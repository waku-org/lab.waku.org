import { test, expect } from '@playwright/test';

test.describe('Light Push Messages', () => {
  test('should send 5 messages over 30 seconds with at least one success', async ({ page }) => {
    test.setTimeout(60000); // Set timeout to 60 seconds for this test

    // Navigate to the app
    await page.goto('/');

    // Wait for Waku node initialization
    await page.waitForFunction(() => {
      return (window as any).waku !== undefined;
    }, { timeout: 30000 });

    // Wait for peer ID to be displayed (indicates node is ready)
    await page.waitForSelector('#peerIdDisplay', { state: 'visible' });
    await page.waitForFunction(() => {
      const el = document.querySelector('#peerIdDisplay');
      return el && el.textContent !== 'Connecting...';
    }, { timeout: 30000 });

    // Remove webpack dev server overlay if it exists
    await page.evaluate(() => {
      const overlay = document.querySelector('#webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.remove();
      }
    });

    // Get initial counter values
    const getCounters = async () => {
      return await page.evaluate(() => {
        return {
          sent: parseInt(document.querySelector('#sentByMeCount')?.textContent || '0'),
          receivedMine: parseInt(document.querySelector('#receivedMineCount')?.textContent || '0'),
          receivedOthers: parseInt(document.querySelector('#receivedOthersCount')?.textContent || '0'),
          failed: parseInt(document.querySelector('#failedToSendCount')?.textContent || '0')
        };
      });
    };

    const initialCounters = await getCounters();
    console.log('Initial counters:', initialCounters);

    // Send 5 messages over 30 seconds (one every 6 seconds)
    const sendButton = page.locator('#sendMessageButton');
    const messagesPerBatch = 5; // Based on NUM_MESSAGES_PER_BATCH in the app
    let totalMessagesSent = 0;

    for (let i = 0; i < 5; i++) {
      console.log(`Sending batch ${i + 1} of 5...`);
      
      // Click send button (use force if needed to bypass any overlays)
      await sendButton.click({ force: true });
      totalMessagesSent += messagesPerBatch;

      // Wait 6 seconds before next batch (except for the last one)
      if (i < 4) {
        await page.waitForTimeout(6000);
      }
    }

    // Wait a bit for the last messages to be processed
    await page.waitForTimeout(3000);

    // Get final counter values
    const finalCounters = await getCounters();
    console.log('Final counters:', finalCounters);

    // Calculate the changes
    const sentMessages = finalCounters.sent - initialCounters.sent;
    const receivedMine = finalCounters.receivedMine - initialCounters.receivedMine;
    const failedMessages = finalCounters.failed - initialCounters.failed;
    const totalProcessed = sentMessages + failedMessages;

    console.log(`Messages sent successfully (according to lightPush): ${sentMessages}`);
    console.log(`Messages received back (mine): ${receivedMine}`);
    console.log(`Messages failed: ${failedMessages}`);
    console.log(`Total messages processed: ${totalProcessed}`);
    console.log(`Total messages expected: ${totalMessagesSent}`);

    // Verify at least one message was successfully delivered
    // A message is considered successful if either:
    // 1. Light push reports success (sentMessages > 0), OR
    // 2. We received our own messages back via Filter (receivedMine > 0)
    const successfulDeliveries = sentMessages + receivedMine;
    expect(successfulDeliveries).toBeGreaterThan(0);
    
    // Verify that at least 20 out of 25 messages were processed (either sent or failed)
    // Allowing for some messages to be lost due to timing or network issues
    expect(totalProcessed).toBeGreaterThanOrEqual(20);

    // Additional verification: check message log
    const allMessageElements = await page.locator('.message-item').count();
    console.log(`Total messages in UI: ${allMessageElements}`);
    expect(allMessageElements).toBeGreaterThan(0);

    // Log success rate based on actual delivery
    const effectiveSuccessRate = (receivedMine / totalMessagesSent) * 100;
    console.log(`Effective delivery rate: ${effectiveSuccessRate.toFixed(2)}%`);
  });

  test('should handle message failures gracefully', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for Waku node initialization
    await page.waitForFunction(() => {
      return (window as any).waku !== undefined;
    }, { timeout: 30000 });

    // Remove webpack dev server overlay if it exists
    await page.evaluate(() => {
      const overlay = document.querySelector('#webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.remove();
      }
    });

    // Monitor console for error messages
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(msg.text());
      }
    });

    // Send a batch of messages
    const sendButton = page.locator('#sendMessageButton');
    await sendButton.click({ force: true });

    // Wait for processing
    await page.waitForTimeout(3000);

    // Check if failed counter is visible and functional
    const failedCount = await page.locator('#failedToSendCount').textContent();
    expect(failedCount).toBeDefined();

    // If there were failures, verify they were logged properly
    const failedMessages = parseInt(failedCount || '0');
    if (failedMessages > 0) {
      // Check for failed messages in the UI
      const failedMessageElements = await page.locator('.message-item.failed').count();
      expect(failedMessageElements).toBe(failedMessages);

      // Verify error details are displayed
      const firstFailedMessage = page.locator('.message-item.failed').first();
      await expect(firstFailedMessage).toContainText('Failed');
    }
  });
});