import { test, expect } from '@playwright/test';

const accounts = [
  ['Citizen', 'citizen@mahasetu.com', 'Citizen@123', 'citizen', undefined],
  ['Employment Officer', 'employment.officer@mahasetu.com', 'Employment@123', 'department_officer', 'Employment Department'],
  ['Education Officer', 'education.officer@mahasetu.com', 'Education@123', 'department_officer', 'Education Department'],
  ['System Administrator', 'admin@mahasetu.com', 'Admin@123', 'admin', undefined],
];
async function login(page, account) {
  const [label, email, password, role] = account;
  await page.goto(role === 'citizen' ? '/login' : '/admin-login');
  const card = page.getByRole('region', { name: 'Demo Credentials' }).locator('div').filter({ has: page.getByRole('heading', { name: label, exact: true }) });
  await card.getByRole('button', { name: 'Use Credentials' }).click();
  await expect(page.locator('input[type=email]')).toHaveValue(email);
  await expect(page.locator('input[type=password]')).toHaveValue(password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(role === 'citizen' ? /\/dashboard$/ : /\/admin$/);
}
async function profile(page) {
  return page.evaluate(async () => {
    const { authApi } = await import('/src/api/auth.api.ts');
    return (await authApi.getMe()).user;
  });
}
async function logout(page, role) {
  await page.locator('header button[aria-expanded]').click();
  await page.getByRole('button', { name: 'Sign Out', exact: true }).click();
  await expect(page).toHaveURL(role === 'citizen' ? /\/login$/ : /\/admin-login$/);
  expect(await page.evaluate(() => localStorage.getItem('mahasetu_auth_token'))).toBeNull();
}
for (const account of accounts) {
  test(`${account[0]} login, refresh, route protection and logout`, async ({ page }) => {
    await login(page, account);
    await page.reload();
    const user = await profile(page);
    expect(user.role).toBe(account[3]);
    expect(user.department).toBe(account[4]);
    expect(user.password).toBeUndefined();
    await page.goto('/admin');
    if (account[3] === 'citizen') await expect(page).toHaveURL(/\/dashboard$/);
    else {
      await expect(page).toHaveURL(/\/admin$/);
      if (account[4]) await expect(page.getByRole('heading', { name: account[4], exact: true })).toBeVisible();
      else await expect(page.getByText('State Administration & Connector Gateway')).toBeVisible();
    }
    await logout(page, account[3]);
  });
}
test('department switching never retains old role or department', async ({ page }) => {
  test.setTimeout(90000);
  page.on('pageerror', error => { throw error; });
  for (const index of [1, 2, 1, 2, 3, 0]) {
    const account = accounts[index];
    await login(page, account);
    const user = await profile(page);
    expect(user.role).toBe(account[3]);
    expect(user.department).toBe(account[4]);
    if (account[4]) await expect(page.getByRole('heading', { name: account[4], exact: true })).toBeVisible();
    await logout(page, account[3]);
  }
});
test('invalid credentials, wrong portal and invalid token are rejected', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin-login\?/);
  for (const [email, password] of [['wrong@example.com', 'wrongpassword'], [accounts[1][1], 'wrongpassword'], [accounts[0][1], accounts[0][2]]]) {
    await page.locator('input[type=email]').fill(email);
    await page.locator('input[type=password]').fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText('Invalid email or password.');
  }
  await page.evaluate(() => localStorage.setItem('mahasetu_auth_token', 'invalid'));
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin-login\?/);
  expect(await page.evaluate(() => localStorage.getItem('mahasetu_auth_token'))).toBeNull();
});
test('registration persists a citizen and rejects duplicate emails and role injection', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Full Name', { exact: false }).fill('Registered Demo');
  await page.locator('input[type=email]').fill('registered@example.com');
  await page.getByLabel('Create Password', { exact: false }).fill('Registered@123');
  await page.getByLabel('Confirm Password', { exact: false }).fill('Registered@123');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  expect((await profile(page)).role).toBe('citizen');
  await logout(page, 'citizen');
  await page.locator('input[type=email]').fill('registered@example.com');
  await page.locator('input[type=password]').fill('Registered@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  const result = await page.evaluate(async () => {
    const { authApi } = await import('/src/api/auth.api.ts');
    let duplicate;
    try { await authApi.register({ name: 'Duplicate', email: 'citizen@mahasetu.com', password: 'Password123' }); }
    catch (error) { duplicate = error.response.status; }
    const { user } = await authApi.register({ name: 'Role attempt', email: 'attempt@example.com', password: 'Password123', role: 'admin', department: 'Education Department' });
    return { duplicate, user };
  });
  expect(result.duplicate).toBe(409);
  expect(result.user.role).toBe('citizen');
  expect(result.user.department).toBeUndefined();
});
