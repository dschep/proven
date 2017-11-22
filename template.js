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
    if (styleSheetNames.has('nightmode_twitter_core.bundle.css'))
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
    twitter: '%%twitter',
  };

  const users = new Map();
  const getUser = (username) => {
    if (!users.has(username)) {
      users.set(
        username,
        fetch(`https://keybase.io/_/api/1.0/user/lookup.json?twitter=${username}`, {
          method: 'GET',
          cors: true,
        })
          .then(resp => resp.json())
          .then(({them: [{proofs_summary: {all}, basics: {username}}]}) => [{
            nametag: username,
            service_url: `https://keybase.io/${username}`,
            proof_type: 'keybase',
          }, ...all])
          .catch(error => {
            if (!error.message.includes('destructure') &&
                !error.message.includes('Symbol.iterator'))
              throw error;
          })
      );
    }
    return users.get(username);
  };

  window.setInterval(() => {
    let user;
    const element = document.querySelector('.ProfileCard-screenname:not(.proven),.ProfileHeaderCard-screenname:not(.proven)');
    if (element) {
      user = element.querySelector('b').innerText;
      element.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs && proofs.map(({proof_type, nametag, service_url}) => {
          if (proof_type === 'twitter') return;
          element.innerHTML += oneLineTrim`
          <br/>
          <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
            <b><span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}</b>
          </a>
          `;
        }));
    }
    const mobileElement = document.querySelector('._2CFyTHU5:not(.proven)');
    if (mobileElement) {
      user = mobileElement.querySelector('.Z5IeoGpY').innerText.replace('@', '');
      mobileElement.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs && proofs.map(({proof_type, nametag, service_url}) => {
          if (proof_type === 'twitter') return;
          mobileElement.innerHTML += oneLineTrim`
          <br/>
          <span class="rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-6gldlz rn-1471scf rn-1lw9tu2 rn-ogifhg rn-7cikom rn-1it3c9n rn-ad9z0x rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bauka4 rn-irrty rn-qvutc0">
            <a style="color:rgb(101,119,134);text-decoration:none;" href="${service_url}" style="" class="">
              <span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}
            </a>
          </span>`;
        }));
    }
  }, 1000);

  window.setInterval(() => {
    Array.from(document.querySelectorAll(
      '.account-group:not(.proven), ._3Qd1FkLM div:not(.proven), .account-inline:not(.proven)'))
      .map(element => {
        element.classList.add('proven');
        let userElement, user, target;
        if (element.classList.contains('account-group')) {
          // twitter.com
          userElement = element.querySelector('.username b');
          if (!userElement) return
          user = userElement.innerText;
          if (!user) return
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
          target = element;
        }
        getUser(user)
          .then((proofs) => proofs && proofs.map(({proof_type, nametag, service_url}) => {
            if (proof_type === 'twitter') return;
            target.innerHTML += oneLineTrim`
            <a href="${service_url}" title="${nametag}">
              <span style="${getStyle()}">${icons[proof_type]}</span>
            </a>`;
          }));
      });
  }, 1000);
})();
