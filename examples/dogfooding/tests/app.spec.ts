import { test, expect } from '@playwright/test';

test.describe('Waku Dogfooding App', () => {
  test('should load the app and initialize Waku node', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the app to load
    await expect(page).toHaveTitle(/Waku/);

    // Wait for Waku node initialization
    await page.waitForFunction(() => {
      return (window as any).waku !== undefined;
    }, { timeout: 30000 });

    // Verify Waku node is available and has expected properties
    const wakuNodeInfo = await page.evaluate(() => {
      const waku = (window as any).waku;
      if (!waku) return null;

      return {
        isStarted: typeof waku.isStarted === 'function' ? waku.isStarted() : false,
        peerId: waku.peerId?.toString() || null,
        hasLightPush: !!waku.lightPush,
        hasFilter: !!waku.filter,
        hasStore: !!waku.store,
      };
    });

    // Assert Waku node is properly initialized
    expect(wakuNodeInfo).not.toBeNull();
    expect(wakuNodeInfo?.isStarted).toBe(true);
    expect(wakuNodeInfo?.peerId).toBeTruthy();
    expect(wakuNodeInfo?.hasLightPush).toBe(true);
    expect(wakuNodeInfo?.hasFilter).toBe(true);
    expect(wakuNodeInfo?.hasStore).toBe(true);

    // Verify UI elements are present
    await expect(page.locator('#peerIdDisplay')).toBeVisible();
    await expect(page.locator('#peerIdDisplay')).not.toHaveText('Connecting...');
    // Peer IDs can start with either 16Uiu2 or 12D3KooW depending on the key type
    const peerIdText = await page.locator('#peerIdDisplay').textContent();
    expect(peerIdText).toMatch(/^(16Uiu2|12D3KooW)/);

    // Verify send message button is present
    await expect(page.locator('#sendMessageButton')).toBeVisible();
  });

  test('should display peer ID in the UI', async ({ page }) => {
    await page.goto('/');

    // Wait for peer ID to be displayed
    await page.waitForSelector('#peerIdDisplay', { state: 'visible' });
    
    // Wait for the actual peer ID to load (not "Connecting...")
    await page.waitForFunction(() => {
      const el = document.querySelector('#peerIdDisplay');
      return el && el.textContent !== 'Connecting...';
    }, { timeout: 30000 });

    const peerIdText = await page.locator('#peerIdDisplay').textContent();
    expect(peerIdText).toBeTruthy();
    expect(peerIdText).toMatch(/^(16Uiu2|12D3KooW)/); // Peer IDs can start with either prefix
  });

  test('should have functional message sending UI', async ({ page }) => {
    await page.goto('/');

    // Wait for Waku node to be ready
    await page.waitForFunction(() => {
      return (window as any).waku !== undefined;
    }, { timeout: 30000 });

    // Check counters are initialized
    await expect(page.locator('#sentByMeCount')).toHaveText('0');
    await expect(page.locator('#receivedMineCount')).toHaveText('0');
    await expect(page.locator('#receivedOthersCount')).toHaveText('0');
    await expect(page.locator('#failedToSendCount')).toHaveText('0');

    // Verify send button is enabled
    const sendButton = page.locator('#sendMessageButton');
    await expect(sendButton).toBeEnabled();
  });
});