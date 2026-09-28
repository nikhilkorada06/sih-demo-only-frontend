import { test, expect } from '@playwright/test';

const emails = { Employment: 'employment.officer@mahasetu.com', Education: 'education.officer@mahasetu.com', Admin: 'admin@mahasetu.com' };
const key = 'mahasetu_department_requests_v1';
async function login(page, department) {
  await page.goto('/admin-login');
  await page.locator('input[type=email]').fill(emails[department]);
  await page.locator('input[type=password]').fill(`${department}@123`);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading', { name: department === 'Admin' ? 'Inter-Department Requests' : `${department} Department`, exact: true })).toBeVisible();
}
async function logout(page) {
  await page.locator('header button[aria-expanded]').click();
  await page.getByRole('button', { name: 'Sign Out', exact: true }).click();
  await expect(page).toHaveURL(/\/admin-login$/);
}
async function create(page, target, citizen) {
  await page.getByRole('button', { name: `Request Data from ${target} Department` }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Citizen')).toContainText(citizen);
  await expect(dialog.getByLabel('Data requested')).toHaveValue(target === 'Education' ? 'Educational Qualification' : 'Employment Status');
  await dialog.getByRole('button', { name: 'Send Data Request' }).click();
  await expect(dialog.getByRole('button', { name: 'Sending request...' })).toBeDisabled();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('status')).toContainText(`Data request sent to ${target} Department`);
}
for (const [source, target, citizen, data] of [
  ['Employment', 'Education', 'Sakshi Verma', 'NIT Agartala'],
  ['Education', 'Employment', 'Nikhil Sharma', 'TechNova Solutions']
]) {
  test(`${source} request → ${target} approval → persisted received data`, async ({ page }) => {
    test.setTimeout(60000);
    page.on('pageerror', error => { throw error; });
    await login(page, source);
    const traffic = [];
    page.on('request', request => { if (['fetch', 'xhr'].includes(request.resourceType()) && !request.url().includes('/src/')) traffic.push(request.url()); });
    await create(page, target, citizen);
    const outgoing = page.getByRole('region', { name: 'Outgoing Data Requests', exact: true });
    await expect(outgoing).toContainText('Pending Approval');
    await expect(page.getByRole('region', { name: `${target} Data Received`, exact: true })).toHaveCount(0);
    const pending = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    expect(pending).toHaveLength(1);
    expect(pending[0].sharedData).toBeNull();
    expect(pending[0].approvedBy).toBeNull();
    const id = pending[0].id;
    expect(id).toBe(target === 'Education' ? 'REQ-EDU-001' : 'REQ-EMP-001');
    // The sender cannot approve its own request, even through the mock service.
    const denied = await page.evaluate(async id => {
      const { authApi } = await import('/src/api/auth.api.ts');
      const { reviewRequest } = await import('/src/mock/exchange.ts');
      try { reviewRequest((await authApi.getMe()).user, id, true); return false; } catch { return true; }
    }, id);
    expect(denied).toBe(true);
    await logout(page);
    await login(page, target);
    const incoming = page.getByRole('region', { name: 'Incoming Data Requests', exact: true });
    await expect(incoming).toContainText(id);
    await expect(incoming).toContainText(citizen);
    await incoming.getByRole('button', { name: 'Approve & Share Data' }).click();
    await expect(page.getByRole('status')).toHaveText('Approving request...');
    await expect(incoming.getByRole('button', { name: 'Reject Request' })).toBeDisabled();
    await expect(incoming).toContainText('Data Shared');
    await expect(page.getByRole('status')).toContainText('Data shared successfully');
    await expect(incoming.getByRole('button')).toHaveCount(0);
    await logout(page);
    await login(page, source);
    await page.reload();
    const received = page.getByRole('region', { name: `${target} Data Received`, exact: true });
    await expect(received).toContainText(citizen);
    await expect(received).toContainText(data);
    await expect(received).toContainText(`Source Department: ${target} Department`);
    await expect(received).toContainText(`Request ID: ${id}`);
    await expect(received).toContainText(emails[target]);
    await expect(outgoing).toContainText('Data Received');
    await expect(page.getByRole('region', { name: 'Data Exchange Audit Log' }).locator('li')).toHaveCount(3);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const section = page.getByRole('region', { name: 'Inter-Department Data Exchange', exact: true });
      expect(await section.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      const box = await section.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    expect(traffic).toEqual([]);
    await logout(page);
    await login(page, 'Admin');
    await expect(page.getByRole('region', { name: 'All Data Requests' })).toContainText(id);
    await expect(page.getByRole('button', { name: 'Approve & Share Data' })).toHaveCount(0);
  });
}
test('rejection persists without data; sequential IDs and repeat review protection', async ({ page }) => {
  test.setTimeout(60000);
  await login(page, 'Employment');
  await create(page, 'Education', 'Sakshi Verma');
  await create(page, 'Education', 'Sakshi Verma');
  await expect(page.getByRole('region', { name: 'Outgoing Data Requests' })).toContainText('REQ-EDU-002');
  await logout(page);
  await login(page, 'Education');
  await page.getByRole('article', { name: 'REQ-EDU-001', exact: true }).getByRole('button', { name: 'Reject Request' }).click();
  await expect(page.getByRole('status')).toContainText('No data was shared.');
  const denied = await page.evaluate(async () => {
    const { authApi } = await import('/src/api/auth.api.ts');
    const { reviewRequest } = await import('/src/mock/exchange.ts');
    try { reviewRequest((await authApi.getMe()).user, 'REQ-EDU-001', true); return false; } catch { return true; }
  });
  expect(denied).toBe(true);
  await logout(page);
  await login(page, 'Employment');
  await page.reload();
  await expect(page.getByRole('article', { name: 'REQ-EDU-001', exact: true })).toContainText('Rejected');
  await expect(page.getByRole('region', { name: 'Education Data Received' })).toHaveCount(0);
  const requests = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(requests.every(r => r.sharedData === null)).toBe(true);
});
test('logout cancels a pending visual action', async ({ page }) => {
  await login(page, 'Employment');
  await create(page, 'Education', 'Sakshi Verma');
  await logout(page);
  await login(page, 'Education');
  await page.getByRole('button', { name: 'Approve & Share Data' }).click();
  await logout(page);
  await page.waitForTimeout(1400);
  const requests = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(requests[0].status).toBe('pending');
  expect(requests[0].sharedData).toBeNull();
});
