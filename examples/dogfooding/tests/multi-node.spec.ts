import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

test.describe('Multi-Node Light Push Messages', () => {
  test('should send messages between two nodes and track delivery', async ({ browser }) => {
    test.setTimeout(90000); // Set timeout to 90 seconds for this test

    // Create two separate browser contexts (like incognito windows)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    // Create pages in each context
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Helper function to initialize a node
    const initializeNode = async (page: Page, nodeName: string) => {
      await page.goto('/');
      
      // Wait for Waku node initialization
      await page.waitForFunction(() => {
        return (window as any).waku !== undefined;
      }, { timeout: 30000 });

      // Wait for peer ID to be displayed
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

      // Get peer ID
      const peerId = await page.locator('#peerIdDisplay').textContent();
      console.log(`${nodeName} initialized with Peer ID: ${peerId}`);

      return peerId;
    };

    // Initialize both nodes
    console.log('Initializing Node 1...');
    const peerId1 = await initializeNode(page1, 'Node 1');
    
    console.log('Initializing Node 2...');
    const peerId2 = await initializeNode(page2, 'Node 2');

    // Helper function to get counters
    const getCounters = async (page: Page) => {
      return await page.evaluate(() => {
        return {
          sent: parseInt(document.querySelector('#sentByMeCount')?.textContent || '0'),
          receivedMine: parseInt(document.querySelector('#receivedMineCount')?.textContent || '0'),
          receivedOthers: parseInt(document.querySelector('#receivedOthersCount')?.textContent || '0'),
          failed: parseInt(document.querySelector('#failedToSendCount')?.textContent || '0')
        };
      });
    };

    // Get initial counters for both nodes
    const initialCounters1 = await getCounters(page1);
    const initialCounters2 = await getCounters(page2);

    console.log('Initial counters Node 1:', initialCounters1);
    console.log('Initial counters Node 2:', initialCounters2);

    // Send 5 batches of messages from Node 1
    console.log('\n--- Starting message sending from Node 1 ---');
    const sendButton1 = page1.locator('#sendMessageButton');
    const messagesPerBatch = 5;
    const totalBatches = 5;

    for (let i = 0; i < totalBatches; i++) {
      console.log(`Node 1: Sending batch ${i + 1} of ${totalBatches}...`);
      await sendButton1.click({ force: true });
      
      // Wait between batches
      if (i < totalBatches - 1) {
        await page1.waitForTimeout(3000);
      }
    }

    // Wait for messages to propagate
    console.log('Waiting for message propagation...');
    await page1.waitForTimeout(5000);

    // Get final counters for both nodes
    const finalCounters1 = await getCounters(page1);
    const finalCounters2 = await getCounters(page2);

    console.log('\n--- Final Results ---');
    console.log('Final counters Node 1:', finalCounters1);
    console.log('Final counters Node 2:', finalCounters2);

    // Calculate results for Node 1 (sender)
    const node1Results = {
      sent: finalCounters1.sent - initialCounters1.sent,
      receivedMine: finalCounters1.receivedMine - initialCounters1.receivedMine,
      receivedOthers: finalCounters1.receivedOthers - initialCounters1.receivedOthers,
      failed: finalCounters1.failed - initialCounters1.failed
    };

    // Calculate results for Node 2 (receiver)
    const node2Results = {
      sent: finalCounters2.sent - initialCounters2.sent,
      receivedMine: finalCounters2.receivedMine - initialCounters2.receivedMine,
      receivedOthers: finalCounters2.receivedOthers - initialCounters2.receivedOthers,
      failed: finalCounters2.failed - initialCounters2.failed
    };

    // Generate report
    console.log('\n========== DELIVERY REPORT ==========');
    console.log(`Total messages sent: ${messagesPerBatch * totalBatches}`);
    console.log('\nNode 1 (Sender):');
    console.log(`  - Peer ID: ${peerId1}`);
    console.log(`  - Messages sent successfully: ${node1Results.sent}`);
    console.log(`  - Messages failed: ${node1Results.failed}`);
    console.log(`  - Own messages received back: ${node1Results.receivedMine}`);
    console.log(`  - Messages from others: ${node1Results.receivedOthers}`);
    
    console.log('\nNode 2 (Receiver):');
    console.log(`  - Peer ID: ${peerId2}`);
    console.log(`  - Messages received from Node 1: ${node2Results.receivedOthers}`);
    console.log(`  - Own messages received: ${node2Results.receivedMine}`);
    
    const totalExpected = messagesPerBatch * totalBatches;
    const node1DeliveryRate = (node1Results.receivedMine / totalExpected) * 100;
    const node2DeliveryRate = (node2Results.receivedOthers / totalExpected) * 100;
    
    console.log('\nDelivery Rates:');
    console.log(`  - Node 1 self-delivery rate: ${node1DeliveryRate.toFixed(2)}%`);
    console.log(`  - Node 2 reception rate: ${node2DeliveryRate.toFixed(2)}%`);
    console.log('=====================================\n');

    // Verify at least one message was delivered
    expect(node1Results.receivedMine + node2Results.receivedOthers).toBeGreaterThan(0);

    // Verify Node 2 received at least some messages from Node 1
    expect(node2Results.receivedOthers).toBeGreaterThan(0);

    // Check message elements in UI
    const messageCount1 = await page1.locator('.message-item').count();
    const messageCount2 = await page2.locator('.message-item').count();
    
    console.log(`Messages in Node 1 UI: ${messageCount1}`);
    console.log(`Messages in Node 2 UI: ${messageCount2}`);

    // Cleanup
    await context1.close();
    await context2.close();
  });

  test('should handle bidirectional messaging between two nodes', async ({ browser }) => {
    test.setTimeout(90000);

    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Initialize both nodes
    const initializeNode = async (page: Page, nodeName: string) => {
      await page.goto('/');
      await page.waitForFunction(() => (window as any).waku !== undefined, { timeout: 30000 });
      await page.waitForSelector('#peerIdDisplay', { state: 'visible' });
      await page.waitForFunction(() => {
        const el = document.querySelector('#peerIdDisplay');
        return el && el.textContent !== 'Connecting...';
      }, { timeout: 30000 });
      await page.evaluate(() => {
        const overlay = document.querySelector('#webpack-dev-server-client-overlay');
        if (overlay) overlay.remove();
      });
      const peerId = await page.locator('#peerIdDisplay').textContent();
      console.log(`${nodeName} initialized with Peer ID: ${peerId}`);
      return peerId;
    };

    await initializeNode(page1, 'Node 1');
    await initializeNode(page2, 'Node 2');

    // Helper to get message counts
    const getMessageCounts = async (page: Page) => {
      return await page.evaluate(() => {
        return {
          receivedOthers: parseInt(document.querySelector('#receivedOthersCount')?.textContent || '0')
        };
      });
    };

    const initial1 = await getMessageCounts(page1);
    const initial2 = await getMessageCounts(page2);

    // Send messages from both nodes alternately
    console.log('\n--- Bidirectional messaging test ---');
    const sendButton1 = page1.locator('#sendMessageButton');
    const sendButton2 = page2.locator('#sendMessageButton');

    for (let i = 0; i < 3; i++) {
      console.log(`Round ${i + 1}: Node 1 sending...`);
      await sendButton1.click({ force: true });
      await page1.waitForTimeout(2000);

      console.log(`Round ${i + 1}: Node 2 sending...`);
      await sendButton2.click({ force: true });
      await page2.waitForTimeout(2000);
    }

    // Wait for final propagation
    await page1.waitForTimeout(3000);

    const final1 = await getMessageCounts(page1);
    const final2 = await getMessageCounts(page2);

    const node1ReceivedFromNode2 = final1.receivedOthers - initial1.receivedOthers;
    const node2ReceivedFromNode1 = final2.receivedOthers - initial2.receivedOthers;

    console.log('\n--- Bidirectional Results ---');
    console.log(`Node 1 received ${node1ReceivedFromNode2} messages from Node 2`);
    console.log(`Node 2 received ${node2ReceivedFromNode1} messages from Node 1`);

    // Verify bidirectional communication
    expect(node1ReceivedFromNode2).toBeGreaterThan(0);
    expect(node2ReceivedFromNode1).toBeGreaterThan(0);

    await context1.close();
    await context2.close();
  });
});