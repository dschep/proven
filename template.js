(function() {
  'use strict';

  // selector for just the @username in the mobile timeline
  const mobileTimelineSelector = '#react-root > div > div > div > main > div > div.css-1dbjc4n.r-aqfbo4.r-e84r5y.r-16y2uox > div > div.css-1dbjc4n.r-14lw9ot.r-1jgb5lz.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div > div > div > div.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div > div > section > div > div > div > div > div > div > article > div > div.css-1dbjc4n.r-1iusvr4.r-46vdb2.r-5f2r5o.r-bcqeeo > div.css-1dbjc4n.r-19i43ro > div.css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-zl2h9q > div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2 > div.css-1dbjc4n.r-1wbh5a2 > a > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-1f6r7vd > div > span'
  // selector for just the @username in mobile profiles
  const mobileProfileSelector = '#react-root > div > div > div > main > div > div.css-1dbjc4n.r-aqfbo4.r-e84r5y.r-16y2uox > div > div.css-1dbjc4n.r-14lw9ot.r-1jgb5lz.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-15d164r.r-1g94qm0 > div > div > div.css-1dbjc4n.r-18u37iz.r-1wbh5a2 > div > span.css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0'

  const icon = (proof_type, colors) => {
    if (proof_type === 'keybase') {
      if (colors)
        return `<img style="height:12px" src="https://keybase.io/images/icons/icon-keybase-logo-48.png">`
      return '%%keybase'
    }
    if (['generic_web_site', 'dns'].includes(proof_type))
      return `<img style="height:12px" src="https://keybase.io/images/paramproofs/services/web/logo_${colors?'full_32':'black_16@2x'}.png">`
    return `<img style="height:12px" src="https://keybase.io/images/paramproofs/services/${proof_type}/logo_${colors?'full_32':'black_16@2x'}.png">`
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
    const {keybaseBadgeOnly, colors} = await getFromStorage(['keybaseBadgeOnly', 'colors']);
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
          <b><span style="${getStyle()}">${icon(proof_type, colors)}</span> ${nametag}</b>
        </a>
        `;
      }
    }
    const mobileElement = document.querySelector(`${mobileProfileSelector}:not(.proven)`);
    if (mobileElement) {
      user = mobileElement.innerText.replace('@', '');
      mobileElement.classList.add('proven');
      const proofs = await getUser(user) || []
      let proof_badges = ''
      for (const {proof_type, nametag, service_url} of proofs) {
        if (proof_type === 'twitter' || (proof_type !== 'keybase' && keybaseBadgeOnly))
          continue;
        proof_badges += oneLineTrim`
        <br/>
        <span>
          <a style="color:rgb(101,119,134);text-decoration:none;" href="${service_url}" style="" class="" rel="noreferrer noopener">
          <span style="${getStyle()}">${icon(proof_type, colors)}</span> ${nametag}
          </a>
        </span>`;
      }
      mobileElement.parentElement.innerHTML +=  proof_badges
    }
  }

  // Add fetch proofs for timeline elements and add badges
  async function addTwitterTimelineBadges(element, keybaseBadgeOnly, colors) {
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
      target = element.parentElement.parentElement.previousSibling;
    }
    const proofs = await getUser(user) || []
    for (const {proof_type, nametag, service_url} of proofs)  {
      if (proof_type === 'twitter' || (proof_type !== 'keybase' && keybaseBadgeOnly))
        continue;
      target.innerHTML += oneLineTrim`&nbsp;
      <a href="${service_url}" title="${nametag}" rel="noreferrer noopener">
        <span style="${getStyle()}">${icon(proof_type, colors)}</span>
      </a>`;
    }
  }

  // select the elements for timelines and call func to add badges
  async function twitterTimeline()  {
    const {keybaseBadgeOnly, colors} = await getFromStorage(['keybaseBadgeOnly', 'colors']);
    for (const element of document.querySelectorAll(
      `.account-group:not(.proven), ${mobileTimelineSelector}:not(.proven), .account-inline:not(.proven)`)) {
      element.classList.add('proven');
      addTwitterTimelineBadges(element, keybaseBadgeOnly, colors);
    }
  }

  async function hackerNews() {
    const {keybaseBadgeOnly, colors} = await getFromStorage(['keybaseBadgeOnly', 'colors']);
    for (const element of Array.from(document.querySelectorAll('.hnuser:not(.proven)'))) {
      element.classList.add('proven');
      const user = element.innerText;
      const proofs = await getUser(user, 'hackernews');
      for (const {proof_type, nametag, service_url} of proofs.slice().reverse()) {
        if (proof_type === 'hackernews' || (proof_type !== 'keybase' && keybaseBadgeOnly)) continue;
        element.insertAdjacentHTML('afterend', `
          <a href="${service_url}" rel="noreferrer noopener"><span style="${getStyle()}">${icon(proof_type, colors)}</span></a>`);
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
