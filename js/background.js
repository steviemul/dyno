const DYN_PREFIX = '/dyn/admin';
const HOST_PATTERNS = [
  'oracleoutsourcing.com'
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (tab.url.indexOf(DYN_PREFIX) > -1) {
    let activate = true;

    HOST_PATTERNS.forEach((pattern) => {
      if (tab.url.indexOf(pattern) > -1) {
        activate = false;
      }
    });

    if (activate) {
      chrome.pageAction.show(tabId);
    }
  }
});

const sendToTab = (tabId, payload) => {

  chrome.tabs.sendMessage(tabId, payload, () => {
    console.info('message acknowledge');
  });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.query === 'dyno-active') {
    sendResponse({'dyno-active': (localStorage.getItem('dyno-active') === 'true')})
  }
  else if(request.action === 'dyno-active') {
    localStorage.setItem('dyno-active', request.value);

    if (request.tabId) {
      sendToTab(request.tabId, request);
    }
  }
});