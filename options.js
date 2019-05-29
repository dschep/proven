const getFromStorage = keys => {
  if (chrome.storage) {
    return new Promise((resolve, reject) =>
      chrome.storage.local.get(keys, resolve)
    );
  } else {
    return browser.storage.local.get(keys);
  }
};
const setToStorage = object => {
  if (chrome.storage) {
    return new Promise((resolve, reject) =>
      chrome.storage.local.set(object, resolve)
    );
  } else {
    return browser.storage.local.set(object);
  }
};
function saveOptions(e) {
  e.preventDefault();
  console.log({
    keybaseBadgeOnly: document.querySelector("#keybase-badge-only").checked,
    colors: document.querySelector("#colors").checked
  });
  setToStorage({
    keybaseBadgeOnly: document.querySelector("#keybase-badge-only").checked,
    colors: document.querySelector("#colors").checked
  });
}

function restoreOptions() {
  function setCurrentChoice({ keybaseBadgeOnly, colors }) {
    console.log(keybaseBadgeOnly, colors);
    document.querySelector("#keybase-badge-only").checked =
      keybaseBadgeOnly || false;
    document.querySelector("#colors").checked = colors || false;
  }

  getFromStorage(["keybaseBadgeOnly", "colors"]).then(setCurrentChoice);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#keybase-badge-only").onchange = saveOptions;
document.querySelector("#colors").onchange = saveOptions;
