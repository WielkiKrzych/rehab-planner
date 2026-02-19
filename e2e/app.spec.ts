import { test, expect } from '@playwright/test';

test.describe('Rehab Planner E2E', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/Rehab Planner/);
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Hasło')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('dashboard loads after login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder('Email').fill('admin@example.com');
    await page.getByPlaceholder('Hasło').fill('admin123');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Witaj w')).toBeVisible();
    await expect(page.getByText('Rehab Planner')).toBeVisible();
  });

  test('navigation to patients page works', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('admin@example.com');
    await page.getByPlaceholder('Hasło').fill('admin123');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL('/');
    
    await page.click('text=Pacjenci');
    await expect(page).toHaveURL('/patients');
    await expect(page.getByText('Brak pacjentów')).toBeVisible();
  });

  test('navigation to plans page works', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('admin@example.com');
    await page.getByPlaceholder('Hasło').fill('admin123');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    
    await page.click('text=Plany');
    await expect(page).toHaveURL('/plans');
  });

  test('navigation to exercises page works', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('admin@example.com');
    await page.getByPlaceholder('Hasło').fill('admin123');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    
    await page.click('text=Ćwiczenia');
    await expect(page).toHaveURL('/exercises');
  });
});
