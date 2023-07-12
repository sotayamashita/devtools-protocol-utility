const CDP = require("chrome-remote-interface");

async function captureConsoleAndNetwork(url) {
  const client = await CDP();

  const { Log, Network, Page } = client;

  // const consoleLogs = [];
  Log.entryAdded(({ entry }) => {
    console.log("[Console]", entry);
  });

  // const networkLogs = [];
  Network.requestWillBeSent(({ request }) => {
    console.log("[Network]", "Request", request);
  });
  Network.responseReceived(({ response }) => {
    console.log("[Network]", "Response", response);
  });

  await Promise.all([Network.enable(), Page.enable(), Log.enable()]);

  await Page.navigate({ url });
  await Page.loadEventFired();
  await Page.reload();

  // Close the browser
  await client.close();
}

captureConsoleAndNetwork("https://www.programiz.com/javascript/console");
