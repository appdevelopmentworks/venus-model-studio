import { test, expect } from '@playwright/test';

const locales = ['ja', 'en', 'ru', 'zh-CN', 'ko'];

/** プリローダー(S1)が消えてホームが操作可能になるまで待つ */
async function waitForHome(page: import('@playwright/test').Page) {
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 15_000 });
  // プリローダーがoverflow:hiddenを外すまで待つ
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-label="LOADING"]'),
    { timeout: 15_000 }
  );
}

/** モバイルならメニューを開き、操作対象のナビ(Mobile/Main)をLocatorで返す */
async function openNavScope(page: import('@playwright/test').Page) {
  const hamburger = page.getByRole('button', { name: /menu|メニュー/i });
  if (await hamburger.isVisible().catch(() => false)) {
    await hamburger.click();
    const mobileNav = page.locator('nav[aria-label="Mobile"]');
    await mobileNav.waitFor({ state: 'visible' });
    return mobileNav;
  }
  return page.locator('nav[aria-label="Main"]');
}

/** デスクトップ/モバイルどちらでも、ヘッダーナビ内のリンクをクリックする */
async function clickNavLink(
  page: import('@playwright/test').Page,
  name: string
) {
  const hamburger = page.getByRole('button', { name: /menu|メニュー/i });
  const isMobile = await hamburger.isVisible().catch(() => false);
  if (isMobile) {
    await hamburger.click();
    const mobileNav = page.locator('nav[aria-label="Mobile"]');
    await mobileNav.waitFor({ state: 'visible' });
    await mobileNav.getByRole('link', { name, exact: true }).first().click();
  } else {
    await page
      .locator('nav[aria-label="Main"]')
      .getByRole('link', { name, exact: true })
      .first()
      .click();
  }
}

test.describe('home per locale', () => {
  for (const locale of locales) {
    test(`renders home for ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await waitForHome(page);
      await expect(page).toHaveTitle(/Venus Model Studio/);
      // AI/REAL区分がページ内に存在する
      await expect(page.getByText('AI MODEL').first()).toBeVisible();
      // 横スクロールが発生しない
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1
      );
      expect(overflow).toBe(true);
    });
  }
});

test('navigation to models and back', async ({ page }) => {
  await page.goto('/en');
  await waitForHome(page);
  await clickNavLink(page, 'Models');
  await expect(page).toHaveURL(/\/en\/models/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('models list to detail', async ({ page }) => {
  await page.goto('/en/models');
  const firstCard = page.locator('main a[href*="/models/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/en\/models\/.+/);
  // 詳細ページにAI/REALラベルとInquiry CTA
  await expect(page.getByText(/AI MODEL|REAL MODEL/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /get in touch/i })).toBeVisible();
});

test('projects list to detail', async ({ page }) => {
  await page.goto('/en/projects');
  const firstCard = page.locator('main a[href*="/projects/"]').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/en\/projects\/.+/);
  await expect(page.getByText('CONCEPT PROJECT').first()).toBeVisible();
});

test('contact form shows validation errors', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByRole('button', { name: /send/i }).click();
  await expect(page.getByText(/please enter your name/i)).toBeVisible();
  await expect(page.getByText(/consent to the privacy policy/i)).toBeVisible();
});

test('locale switcher keeps the same page', async ({ page }) => {
  await page.goto('/en/about');
  const navScope = await openNavScope(page);
  await navScope.getByRole('link', { name: 'JA', exact: true }).first().click();
  await expect(page).toHaveURL(/\/ja\/about/);
});

test('keyboard navigation reaches the contact CTA', async ({ page }) => {
  await page.goto('/en/about');
  const navScope = await openNavScope(page);
  // Contactリンク(デスクトップはヘッダー、モバイルはメニュー内)がフォーカス可能
  const contact = navScope
    .getByRole('link', { name: 'Contact', exact: true })
    .first();
  await contact.focus();
  await expect(contact).toBeFocused();
});
