chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
    await chrome.scripting.executeScript({
        target: {tabId},
        files: ['content-script.js'],
    })
});