const getFromStorage = (keys) => {
  if (chrome.storage) {
    return new Promise((resolve, reject) => chrome.storage.local.get(keys, resolve));
  } else {
    return browser.storage.local.get(keys);
  }
};
const setToStorage = (object) => {
  if (chrome.storage) {
    return new Promise((resolve, reject) => chrome.storage.local.set(object, resolve));
  } else {
    return browser.storage.local.set(object);
  }
};
function saveOptions(e) {
  e.preventDefault();
  setToStorage({
    keybaseBadgeOnly: document.querySelector("#keybase-badge-only").checked,
  });
}

function restoreOptions() {
  function setCurrentChoice({keybaseBadgeOnly}) {
    console.log(keybaseBadgeOnly)
    document.querySelector("#keybase-badge-only").checked = keybaseBadgeOnly || false;
  }

  getFromStorage('keybaseBadgeOnly').then(setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("input").onchange = saveOptions;
