# MahaSetu homepage correction pass

Completed 2026-09-09. Working-tree changes only; no commit or push.

## Fixes

- Restored the two supplied banner images in a full-width horizontal carousel. No text/CTA overlays. Previous/next arrows, dots, six-second autoplay, pause, hover/focus pause, and reduced-motion support.
- Removed both homepage video embeds and their bundle imports. The original MP4 files remain in `utilities/Videos/`.
- Kept the supplied MahaSetu logo unchanged. Downloaded Digital India and department/government logos from public official sources; see [asset sources](../src/assets/SOURCES.md).
- Preserved the government utility bar; made the local Digital India logo readable on white and wrapped controls on small screens.
- Kept exactly Home, Departments, Documents, and Grievances in desktop/mobile navigation. Connected existing English, Hindi, and Marathi navbar translations and document language to the selector.
- Replaced What's New placeholders and fabricated service counts with seven real Maharashtra departments and official logos. The common state emblem is used where a department shares the state identity.
- Popular Service contains the eight requested certificate/verification services with consistent open-source icons and independently responding cards.
- Removed the shared carousel `group` hover scope. Carousel dots and page movement now use measured card/viewport widths. Both carousels support touch scrolling and keyboard navigation.
- Preserved a static 2×2 Benefits grid on blue, with consistent blue icons and no person or flip.
- Preserved six categories in a 3×2 desktop grid. Each category owns its flip state, supports mouse/touch/keyboard, and uses a 600ms transition. Backs are #00599F with white text and an Explore link.
- Replaced the video journey with six numbered, connected steps and a single sequential entrance animation.
- Changed Need Help to a large rounded panel with support actions and open-source Lucide headset/message artwork.
- Preserved the light-blue multi-column footer and the required homepage order. No visitor counter or excluded marketing/statistics sections.
- Fixed homepage/search links to unregistered `/services` and `/schemes` paths by using existing department/document routes. Added search dialog/input semantics, a close button, keyboard activation of service results, and valid theme colours.
- Preserved accessibility controls; labelled their checkboxes, applied enhanced paragraph line height, and kept category contrast in dark mode.

## Build and browser verification

`npm run build` in `frontend/`: PASS (TypeScript + Vite production build). The emitted assets contain the supplied images and no MP4s.

Actual rendered page inspected with Playwright/Chromium 153.0.8010.12 at `http://127.0.0.1:5173/`. All six user-provided UMANG screenshots were inspected as visual references. Layout was compared for hierarchy, white space, carousel/card treatment, Benefits, Categories, and Need Help; this is an original MahaSetu implementation, not a pixel-identical copy.

| Viewport | Document width | Hero x / width | Benefits | Categories | Broken images |
| --- | --- | --- | --- | --- | --- |
| 1920 × 1080 | 1920px | 0 / 1920px | 2×2 | 3×2 | 0 |
| 1440 × 900 | 1440px | 0 / 1440px | 2×2 | 3×2 | 0 |
| 1366 × 768 | 1366px | 0 / 1366px | 2×2 | 3×2 | 0 |
| 1024 × 768 | 1024px | 0 / 1024px | 2×2 | 3×2 | 0 |
| 390 × 844 | 390px | 0 / 390px | 1 column | 1 column | 0 |
| 375 × 812 | 375px | 0 / 375px | 1 column | 1 column | 0 |

No horizontal overflow, no rendered videos, and no uncaught page errors in the six-width layout run. Enlarged text (125%) plus enhanced spacing and Marathi navigation also produced no overflow at all six widths.

Browser interaction assertions passed:

- Hero next arrow selects second image.
- Hero previous arrow returns to first image.
- Hero dot selects second image.
- Hero autoplays after six seconds.
- Hero pause stops autoplay.
- What's New departments: next arrow scrolls.
- What's New departments: dots return to first page.
- What's New departments: only third card lifts.
- Popular Service: next arrow scrolls.
- Popular Service: dots return to first page.
- Popular Service: only third card lifts.
- Only hovered category flips.
- Category back is blue with white text.
- Keyboard flips only focused category.
- Escape closes category.
- Dark mode changes document theme.
- Category remains blue and white in dark mode.
- Marathi selector changes navbar and document language.
- Language selection persists.
- Hindi navbar translation works.
- Accessibility icon opens panel.
- Text resize applies.
- High contrast applies.
- dyslexia-font control applies.
- enhanced-spacing control applies.
- highlight-links control applies.
- pause-animations control applies.
- Spacing affects paragraph line height.
- Accessibility pause halts hero autoplay.
- Reset clears accessibility settings.
- Navbar search opens.
- /departments route renders.
- /documents route renders.
- /grievances route renders.
- /login route renders.
- /register route renders.
- /help route renders.
- Mobile menu opens.
- Mobile menu has exactly four links.
- Mobile navigation works and closes.
- Mobile carousel can reach final service.
- Touch flips only tapped category.
- Touch toggle closes category.
- Native touch swipe moves department carousel.
- Reduced motion disables automatic hero playback.
- Manual hero controls work with reduced motion.
- No overflow with enlarged text, enhanced spacing and Marathi navigation at all six widths.
- Benefits have four static cards and no person/image/video.
- Search filters results and navigates to an existing department route.
- Footer has no visitor counter.
- Desktop navigation has exactly four links.
- Six categories and six journey steps render.

The final desktop carousel-width refinement was additionally checked with arrow/dot navigation and a rendered screenshot. Screenshot artifacts and detailed JSON results are in `/tmp/mahasetu-qa/`; temporary browser scripts are in `/tmp/pw-runner/` and add no project dependencies.

## Remaining limitations

- No known failures in the homepage checks above. Browser verification used Chromium; Safari/Firefox and physical devices were not tested.
- Login/registration and other existing routes were checked for rendering during the original homepage pass. Authentication and backend flows are covered by their dedicated self-checks.
- The language selector now translates the existing navigation dictionary and persists the preference. Most homepage body copy remains English, with existing Marathi service/category labels; a full content translation was outside this correction pass.
- Service/category links use the existing directory and documents pages; this UI pass does not implement new backend certificate services. Department update cards link to the official public websites.
- Original banner images are unchanged. Their wide proportions are retained on mobile; text embedded in the supplied second image is naturally smaller there.

## Files changed or added

Paths are relative to `frontend/`. This list was determined against a snapshot taken before edits because the frontend directory was already untracked in Git.

- `src/assets/SOURCES.md`
- `src/assets/assets.ts`
- `src/assets/digital-india.svg`
- `src/assets/maharashtra-government.png`
- `src/assets/maharashtra-transport.jpg`
- `src/assets/mahaswayam.png`
- `src/components/common/Carousel.tsx`
- `src/components/common/GlobalSearchModal.tsx`
- `src/components/home/BenefitsSection.tsx`
- `src/components/home/CategoriesSection.tsx`
- `src/components/home/HeroBannerCarousel.tsx`
- `src/components/home/HowItWorksSection.tsx`
- `src/components/home/NeedHelpSection.tsx`
- `src/components/home/PopularServicesSection.tsx`
- `src/components/home/WhatsNewSection.tsx`
- `src/components/layout/AccessibilityModal.tsx`
- `src/components/layout/FloatingControls.tsx`
- `src/components/layout/GovernmentBar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MobileDrawer.tsx`
- `src/context/LanguageContext.tsx`
- `src/index.css`
- `src/pages/HomePage.tsx`
- `docs/homepage-qa.md` (this report)

`dist/` was regenerated by the build. Supplied files in `utilities/images/` and `utilities/Videos/` were not modified.
