(function() {
  'use strict';

  const icon = proof_type => {
    if (proof_type === 'keybase') {
      return '%%keybase'
    }
    if (['generic_web_site', 'dns'].includes(proof_type))
      return `<img style="height:12px" src="https://keybase.io/images/paramproofs/services/web/logo_black_16@2x.png">`
    return `<img style="height:12px" src="https://keybase.io/images/paramproofs/services/${proof_type}/logo_black_16@2x.png">`
  }


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

  // template literal tag to remove new line and whitespace at start&end of line
  const oneLineTrim = (literals, ...substitutions) => {
    let result = '';
    for (const i in literals) {
      result += literals[i].split(/\n/g).map(s => s.trim()).join('');
      if (i < substitutions.length)
        result += substitutions[i];
    }
    return result;
  };

  // get style tag contents. Height & invert if night mode detected
  const getStyle = () => {
    const styleSheetNames = new Set(Array.from(document.styleSheets).map(({href}) => href && href.split('/').pop()));
    let style = 'margin-right: 2px;';
    if (styleSheetNames.has('nightmode_twitter_core.bundle.css') ||
        document.body.parentElement.classList.contains('dark'))
      style += 'filter: invert(100%);';
    if (window.location.host === 'news.ycombinator.com')
      style += 'opacity: 0.6;'
    return style;
  };

  // Get proofs from storage or Keybase
  async function getProofsFromStorageOrKeybase(username, service = 'twitter') {
    const key = `${service}://${username}`;
    const fromStorage = await getFromStorage(key);
    const timestamp = Math.round((new Date()).getTime() / 1000);
    if (fromStorage[key] && fromStorage[key].timestamp > timestamp - 3*60*60) {
      return fromStorage[key].proofs;
    } else {
      const newProofs = await fetchProofs(username, service);
      await setToStorage({[key]: {proofs: newProofs, timestamp}});
      return newProofs;
    }
  }

  // Fetch proofs from Keybase
  async function fetchProofs(username, service = 'twitter', retry = 3) {
    const resp = await fetch(
      `https://keybase.io/_/api/1.0/user/lookup.json?${service}=${username}`,
      {
        method: 'GET',
        cors: true,
      });
    if (resp.status !== 200) {
      if (retry === 0) {
        throw e;
      }
      return new Promise((resolve) => setTimeout(() => resolve(fetchProofs(username, service, retry - 1)), 1000))
    }
    const respObj = await resp.json();
    if (!respObj.them[0])
      return [];
    return [{
      nametag: username,
      service_url: `https://keybase.io/${respObj.them[0].basics.username}`,
        proof_type: 'keybase',
    }, ...respObj.them[0].proofs_summary.all];
  }

  const users = new Map(); // user proof cache
  // Get user's proofs, from cache or fetch and update cache
  async function getUser(username, service = 'twitter')  {
    if (!users.has(username)) {
      users.set(username, getProofsFromStorageOrKeybase(username, service));
    }
    return users.get(username);
  };

  // Add fetch proofs for profile elements and add badges
  async function twitterProfiles() {
    const {keybaseBadgeOnly} = await getFromStorage('keybaseBadgeOnly');
    let user;
    const element = document.querySelector('.ProfileCard-screenname:not(.proven),.ProfileHeaderCard-screenname:not(.proven)');
    if (element) {
      user = element.querySelector('b').innerText;
      element.classList.add('proven');
      const proofs = await getUser(user) || []
      for (const {proof_type, nametag, service_url} of proofs) {
        if (proof_type === 'twitter' || (proof_type !== 'keybase' && keybaseBadgeOnly))
          continue;
        element.innerHTML += oneLineTrim`
        <br/>
        <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav" rel="noreferrer noopener">
          <b><span style="${getStyle()}">${icon(proof_type)}</span> ${nametag}</b>
        </a>
        `;
      }
    }
    const mobileElement = document.querySelector('._2CFyTHU5:not(.proven)');
    if (mobileElement) {
      user = mobileElement.querySelector('.Z5IeoGpY').innerText.replace('@', '');
      mobileElement.classList.add('proven');
      const proofs = await getUser(user) || []
      for (const {proof_type, nametag, service_url} of proofs) {
        if (proof_type === 'twitter' || (proof_type !== 'keybase' && keybaseBadgeOnly))
          continue;
        mobileElement.innerHTML += oneLineTrim`
        <br/>
        <span class="rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-6gldlz rn-1471scf rn-1lw9tu2 rn-ogifhg rn-7cikom rn-1it3c9n rn-ad9z0x rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bauka4 rn-irrty rn-qvutc0">
          <a style="color:rgb(101,119,134);text-decoration:none;" href="${service_url}" style="" class="" rel="noreferrer noopener">
          <span style="${getStyle()}">${icon(proof_type)}</span> ${nametag}
          </a>
        </span>`;
      }
    }
  }

  // Add fetch proofs for timeline elements and add badges
  async function addTwitterTimelineBadges(element, keybaseBadgeOnly) {
    let userElement, user, target;
    if (element.classList.contains('account-group')) {
      // twitter.com
      userElement = element.querySelector('.username b');
      if (!userElement)
        return;
      user = userElement.innerText;
      if (!user)
        return;
      target = element.querySelector('.UserBadges');
    } else if (element.classList.contains('account-inline')) {
      // tweetdeck.twitter.com
      userElement = element.querySelector('.username');
      user = userElement.innerText.replace('@', '');
      userElement.outerHTML = '<span class="UserBadges"></span> ' + userElement.outerHTML;
      target = element.querySelector('.UserBadges');
    } else {
      // mobile.twitter.com
      user = element.innerText.replace('@', '');
      target = element.parentElement.previousSibling;
    }
    const proofs = await getUser(user) || []
    for (const {proof_type, nametag, service_url} of proofs)  {
      if (proof_type === 'twitter' || (proof_type !== 'keybase' && keybaseBadgeOnly))
        continue;
      target.innerHTML += oneLineTrim`&nbsp;
      <a href="${service_url}" title="${nametag}" rel="noreferrer noopener">
        <span style="${getStyle()}">${icon(proof_type)}</span>
      </a>`;
    }
  }

  // select the elements for timelines and call func to add badges
  async function twitterTimeline()  {
    const {keybaseBadgeOnly} = await getFromStorage('keybaseBadgeOnly');
    for (const element of document.querySelectorAll(
      '.account-group:not(.proven), ._3Qd1FkLM div:not(.proven), .account-inline:not(.proven)')) {
      element.classList.add('proven');
      addTwitterTimelineBadges(element, keybaseBadgeOnly);
    }
  }

  async function hackerNews() {
    const {keybaseBadgeOnly} = await getFromStorage('keybaseBadgeOnly');
    for (const element of Array.from(document.querySelectorAll('.hnuser:not(.proven)'))) {
      element.classList.add('proven');
      const user = element.innerText;
      const proofs = await getUser(user, 'hackernews');
      for (const {proof_type, nametag, service_url} of proofs.slice().reverse()) {
        if (proof_type === 'hackernews' || (proof_type !== 'keybase' && keybaseBadgeOnly)) continue;
        element.insertAdjacentHTML('afterend', `
          <a href="${service_url}" rel="noreferrer noopener"><span style="${getStyle()}">${icon(proof_type)}</span></a>`);
      }
    }
  }

  // call timeline&profile funcs every second since twitter constantly updates
  if (window.location.host.endsWith('twitter.com'))
    window.setInterval(twitterTimeline, 1000);
  if (window.location.host.endsWith('twitter.com'))
    window.setInterval(twitterProfiles, 1000);
  if (window.location.host === 'news.ycombinator.com')
    hackerNews();
})();
