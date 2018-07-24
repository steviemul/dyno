const activated = (localStorage.getItem('dyno-active') === 'true');
let tabId;

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  tabId = tabs[0].id;
});

window.onload = () => {

  const checkbox = document.getElementById('id-name--1');

  chrome.runtime.sendMessage({query: 'dyno-active'}, function(response) {
    checkbox.checked = response['dyno-active'];
  });

  checkbox.addEventListener('change', (evt) => {
    chrome.runtime.sendMessage({action: 'dyno-active', value: evt.target.checked, tabId:tabId});
  });
};

