// ==UserScript==
// @name         Proven
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show Keybase Proofs on Twitter Profiles
// @author       Daniel Schep
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const users = new Map();
    const getUser = (username) => {
        if (!users.has(username)) {
            users.set(
                username,
                new Promise((resolve, reject) => GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://keybase.io/_/api/1.0/user/lookup.json?twitter=${username}`,
                    onload: resolve,
                    onerror: reject,
                }))
                  .then(({response}) => JSON.parse(response))
                  .then(({them}) => them.map(({proofs_summary: {by_proof_type}}) => by_proof_type))
            );
        }
        return users.get(username);
    };
    const user = document.querySelector('.ProfileHeaderCard-screenname b').innerText;
    const element = document.querySelector('.ProfileHeaderCard-screenname');
    getUser(user)
      .then(([by_proof_type]) => Object.entries(by_proof_type)
            .reduce((all_proofs, [type, proofs]) => all_proofs.concat(proofs), [])
            .map(({presentation_group, nametag, service_url}) => ({
        label: presentation_group === nametag ? nametag : `${presentation_group}: ${nametag}`,
        url: service_url,
    })))
      .then((proofs) => proofs.map(({label, url}) => {
        element.innerHTML +=`
          <br/>
          <a href="${url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
            <b>🔑 ${label}</b>
          </a>
        `;
    }));
})();
