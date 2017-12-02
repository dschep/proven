(function() {
  'use strict';

  const oneLineTrim = (literals, ...substitutions) => {
    let result = '';
    for (const i in literals) {
      result += literals[i].split(/\n/g).map(s => s.trim()).join('');
      if (i < substitutions.length)
        result += substitutions[i];
    }
    return result;
  };

  const getStyle = () => {
    const styleSheetNames = new Set(Array.from(document.styleSheets).map(({href}) => href && href.split('/').pop()));
    let style = 'margin-right: 2px;';
    if (styleSheetNames.has('nightmode_twitter_core.bundle.css') ||
        document.body.parentElement.classList.contains('dark'))
      style += 'filter: invert(100%);';
    return style;
  };

  const icons = {
    keybase: '%%keybase',
    hackernews: '%%hackernews',
    reddit: '%%reddit',
    github: '%%github',
    generic_web_site: '%%generic_web_site',
    dns: '%%generic_web_site',
    facebook: '%%facebook',
  };

  const users = new Map();
  async function fetchProofs(username, service = 'twitter') {
    const resp = await fetch(`https://keybase.io/_/api/1.0/user/lookup.json?${service}=${username}`, {
      method: 'GET',
      cors: true,
    });
    const respObj = await resp.json();
    if (!respObj.them[0])
      return;
    return [{
      nametag: username,
      service_url: `https://keybase.io/${username}`,
        proof_type: 'keybase',
    }, ...respObj.them[0].proofs_summary.all];
  }
  function getUser(username, service = 'twitter')  {
    if (!users.has(username)) {
      users.set(username, fetchProofs(username, service));
    }
    return users.get(username);
  };
  async function twitterProfiles() {
    let user;
    const element = document.querySelector('.ProfileCard-screenname:not(.proven),.ProfileHeaderCard-screenname:not(.proven)');
    if (element) {
      user = element.querySelector('b').innerText;
      element.classList.add('proven');
      const proofs = await getUser(user) || []
      for (const {proof_type, nametag, service_url} of proofs) {
        if (proof_type === 'twitter')
          continue;
        element.innerHTML += oneLineTrim`
        <br/>
        <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
          <b><span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}</b>
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
        if (proof_type === 'twitter')
          continue;
        mobileElement.innerHTML += oneLineTrim`
        <br/>
        <span class="rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-6gldlz rn-1471scf rn-1lw9tu2 rn-ogifhg rn-7cikom rn-1it3c9n rn-ad9z0x rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bauka4 rn-irrty rn-qvutc0">
          <a style="color:rgb(101,119,134);text-decoration:none;" href="${service_url}" style="" class="">
            <span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}
          </a>
        </span>`;
      }
    }
  }

  async function addTwitterTimelineBadges(element) {
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
      if (proof_type === 'twitter')
        continue;
      target.innerHTML += oneLineTrim`
      <a href="${service_url}" title="${nametag}">
        <span style="${getStyle()}">${icons[proof_type]}</span>
      </a>`;
    }
  }

  function twitterTimeline()  {
    for (const element of document.querySelectorAll(
      '.account-group:not(.proven), ._3Qd1FkLM div:not(.proven), .account-inline:not(.proven)')) {
      element.classList.add('proven');
      addTwitterTimelineBadges(element);
    }
  }

  if (window.location.host.endsWith('twitter.com'))
    window.setInterval(twitterTimeline, 1000);
  if (window.location.host.endsWith('twitter.com'))
    window.setInterval(twitterProfiles, 1000);
})();
