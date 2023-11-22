chrome.storage.sync.get(['status', 'show_usd'], function (result) {
    document.querySelector('#statusCheck').checked = (result.status ?? true);
    document.querySelector('#showUsdCheck').checked = (result.show_usd ?? true);
});

document.querySelector('#statusCheck').addEventListener('change', function () {
    chrome.storage.sync.set({status: this.checked});
});
document.querySelector('#showUsdCheck').addEventListener('change', function () {
    chrome.storage.sync.set({show_usd: this.checked});
});