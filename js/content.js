const HOST_PATTERNS = [
  'oracleoutsourcing.com'
];

const BUTTON_TAGS = [
  'INPUT',
  'BUTTON'
];

const ALL_ACTION_TAGS = [
  ...BUTTON_TAGS,
  'A'
];

const url = document.location.href;
const origin = document.location.origin;
const encodedOrigin = btoa(origin);
const path = document.location.pathname;
const DYN_PREFIX = '/dyn/admin';

const WARNING_OPTIONS = [
  {'name' : 'All Clicks', 'value':'all'},
  {'name' : 'Buttons Only', 'value':'buttons'},
  {'name' : 'No Warnings', 'value' : 'none'}
];

let selectedOption = 'all';

const retrieveSettings = () => {
  selectedOption = localStorage.getItem('dyno-selected-option') || 'all';

  console.info('Read selected option value as ' + selectedOption);
};

const storeSettings = (setting) => {
  localStorage.setItem('dyno-selected-option', setting);
};

const optionChange = (evt) => {
  selectedOption = evt.target.value;

  storeSettings(selectedOption);
};

const options = () => {
  const div = document.createElement('div');
  const h = document.createElement('h3');
  const optionsContainer = document.createElement('div');
  const options = document.createElement('select');
  const label = document.createElement('label');

  label.for = 'warningOptions';
  label.innerText = 'Click Confirm Policy : ';
  options.id = 'warningOptions';

  optionsContainer.classList.add('dyno__options');
  optionsContainer.appendChild(label);
  optionsContainer.appendChild(options);

  WARNING_OPTIONS.forEach((warningOption) => {
    const option = document.createElement('option');

    option.value = warningOption.value;
    option.innerText = warningOption.name;

    if (option.value === selectedOption) {
      option.selected = true;
    }

    options.appendChild(option);
  });

  options.addEventListener('change', optionChange);

  h.innerText = origin;

  div.appendChild(h);
  div.appendChild(optionsContainer);

  return div;
};

const handle = (parent) => {

  const div = document.createElement('div');

  div.classList.add('dyno__handle');
  div.title = 'Expand Options';

  for (let i=0;i<3;i++) {
    div.appendChild(document.createElement('span'));
  }

  div.addEventListener('click', () => {

    if (parent.hasAttribute('opened')) {
      parent.removeAttribute('opened');
      div.setAttribute('title', 'Expand Options');
    }
    else {
      parent.setAttribute('opened', true);
      div.setAttribute('title', 'Close Options');
    }
  });

  return div;
};

const shouldActivate = () => {

  let activate = false;

  if (path.indexOf(DYN_PREFIX) == 0) {
    HOST_PATTERNS.forEach((pattern) => {
      if (url.indexOf(pattern) > -1) {
        activate = true;
      }
    });
  }

  return activate;
};

const activate = () => {
  retrieveSettings();

  const body = document.getElementsByTagName('body')[0];

  const stripe = document.createElement('div');

  stripe.classList.add('dyno__stripe');

  const dialog = document.createElement('div');

  dialog.classList.add('dyno__dialog');

  dialog.appendChild(options());
  dialog.appendChild(handle(dialog));

  body.appendChild(dialog);
  body.appendChild(stripe);

  body.addEventListener('click', (evt) => {

    if (selectedOption === 'none') {
      return;
    } else if (selectedOption === 'buttons' && !BUTTON_TAGS.includes(evt.target.tagName)) {
      return;
    }

    if (ALL_ACTION_TAGS.includes(evt.target.tagName)) {

      const answer = confirm("Are you sure you want to perform this action ?");

      if (!answer) {
        evt.preventDefault();
      }
    }
  });
};

const deactivate = () => {
  const stripe = document.getElementsByClassName('dyno__stripe')[0];
  const dialog = document.getElementsByClassName('dyno__dialog')[0];

  const body = document.getElementsByTagName('body')[0];

  body.removeChild(stripe);
  body.removeChild(dialog);
};

if (shouldActivate()) {
  activate();
}

chrome.runtime.sendMessage({query: 'dyno-active'}, function(response) {
  if (response['dyno-active']) {
    activate();
  }
});

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.action === 'dyno-active') {
    if (request.value) {
      activate();
    }
    else {
      deactivate();
    }
    
    sendResponse({acknowledged: true});
  }
});

