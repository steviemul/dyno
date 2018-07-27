const activated = (localStorage.getItem('dyno-active') === 'true');
let tabId;
let url;

window.onload = () => {

  const checkbox = document.getElementById('id-name--1');

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    tabId = tabs[0].id;
    url = tabs[0].url;

    chrome.runtime.sendMessage({query: 'dyno-active', url: url}, function(response) {
      checkbox.checked = response['dyno-active'];
    });
  });

  checkbox.addEventListener('change', (evt) => {
    chrome.runtime.sendMessage({action: 'dyno-active', value: evt.target.checked, tabId:tabId, url: url});
  });
};

