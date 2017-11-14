// ==UserScript==
// @name         Proven
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show Keybase Proofs on Twitter Profiles
// @author       Daniel Schep
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const icons = {
        keybase: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMATQcgiMpoQAAAWNJREFUOMuN0r9L1WEUx/GX8hUzu4GUiZVaIA2CCcpdJByCIEoKQxqUQBz88Rek4NpUIU5uQhAE4VA0CSFNLm5iWJMkLg2aaIIOelvOhacviPezPJxznufD57x5+F8XcR/FOD86R1muXsAVXEUHltGKrbMMqnL1OmbQi2s4QR++YQyl8xItYAN7uJmk/IJhFagKt/En1x/BbCUMStjGPh5G/AztkaoWx+mD6pzBvVihhLnY+3IArcYPPDgr/lMc4Q3qUINFvMInPMFd/MRo/nE7DvE26utxTuI1+rEWvWZsois1eIdfseNzDEa/EV/xAS+S++NYKheX8Bcv8SgAFmJWiwZcyCUewiluZOhEfcBaDIhTeIYmHMQX38UqdmK2hmKGW+E6ge+4EzAHgnpZrbF3Q3CZQiFL4k2jG49jpWJiUEBL/MiymvBbwHmP+WTYgc9J3RMgU22EqSwYbKNNZerFCvwDDf1EbHQFhUQAAAAASUVORK5CYII=',
        hackernews: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUarR2LJgAAAKNJREFUOMvFkzsOwyAQRB8hd+IGew9aSxRIyKUVn863cUVDtSkiWfEnGMWKMhXMrnZmxGIA5QJuXMRqQAgBVWUcx12j9x5VJYSw4s02gurraoyhhd9F6PsegGEYFq7rulWt6uBI7ZM6gAUeWzLnjIhQSsE5h4iQUmKapjYH76pL44F69RljjIfnZgdn2ZsWaRvj95v4De614jzPWGurA8zff+MTlW89eZm3DJYAAAAASUVORK5CYII=',
        reddit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUIXqT6bgAAAU1JREFUOMut0r9L1lEYBfDPa6++oCAuDtEoQRBRg+Bgw0u9gTYZhS415lCDiOIouQr+AW1REESDOjgIZrlJRFJIBOniJIIV+AvRxOUI30HohXqWy733Oeeec57LP9aFOvva0YgKnuE+vuNXQx3g5/iCdazhErYwW8/LnQFVonYJj3Edv/8GbsAw3hasdmMTOyFSRhMeog1z6EM/rmA33vfwFS9QSwblKPMa77GIk3i7g+aCmhbcxgz+4APe4Y3IqSaYuwE0nWOpkrUnvVXsw8uQjKbhHg7xqAAewFHuYCSYV2c5bONyIagf6C0Q1DKNm9l34GewYCXAequKT8WDYSzEZwnLGAtpDRP4mNFWEuKQNJ/ZmEYrBrN/gmtJ/XOy2svP3MUDHJUKKsp4inF8y1g3cICr6MINTGEyxErn+GvGrci/iOMQrWI+Kv5fnQI3V0l+bKwI4gAAAABJRU5ErkJggg==',
        twitter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQQtDLsfaAAAASFJREFUOMu10jFrVUEQBeBvZo1IUPIKLQQbixSp7FQIom3SWMXq/Yr0/gILm5TpAklrrSkULMTqYSNpDcQimATUYNDnWuRGLsm7lwfigWGH2TnnLDPLP6JM2XeT8oS4Rz3CQVO/BjfIpz3kRyEPQ9YmfqRcC+U1FlCWQtaUz3HlHDlDfmqRW1Hek6twt3XxkbKCy43A/GRy1pSbmIEI5d25hv0QL1KudwmczoRLWOT3F6IiGufrxOPaO9fx57NsEPKgy6kjTnAVEkdVDPF1+u3XbXxrV2ZTboT8Oc0L8PDvmprzGLvNTHoRbOFN18dcDvGyx32EuQ5hd1I+C/l9MjleYTCJ/CCUtz2uHyjD1oovOJ/hNuU+9RZ+EXuMR9jxP/EHGLBvXbXVSZYAAAAASUVORK5CYII=',
        github: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUQTchiOAAAAR9JREFUOMut00srxWEQBvDfOe6S20kJ5ZIUK4WFlYWUPZ2ifAkbn0DKp7Cycdkp2SK3RKKsSHZsSHJcis2oNwvp5K3p/T8zzzz/mekd/ukMYQmjyPzCy2AMyxhMA/P4DNvHCDowENYV4ocJbyEVWEkCf7V1yIZAUxFtN39/tOC5iAoK6CzBIoaLqKAUdRlcoTOcBVziISZekyS8oBL9kQy38BolXaP1D39uw1nShvsA+SDMYge5JKke25gLnI+cG9gK0JeU9YnpRGAyfHeBewNvZrEazu64T/GB80TgAm84Cfw9szUoxzH2UI2qhJCe9ohXYBdHKMuG8jie4hnPRM85NITl0Iip4DzGTrz/XJxBTKAHtT9izzH9DRz81xb7AsfEVvjNe2/cAAAAAElFTkSuQmCC',
        generic_web_site: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUBJ3hCygAAAR9JREFUOMul07suBFAQBuCPhGpb2q3XpUO9pZJXcElcHkGJDrtLbDyAN6ASote61Ao6GqsRy2r+lc3uRohJJpkz/z/nzMyZoVcmUMUNXqM3qGDcDzKMQ3yghTdsYit2C00chNsTfIGXvP6JlQ58Lb5qOOfdl9QDTOEI9xjswAfjq2MGDey3wcmktpDzI45Rxly0HN9DOEuJGZO0nrCBq9T6k16F+4xduAvQwGXsWRRRiBbja4XTiH0thxOMYD5Aoc8vFYLNYxSneGk3aiD6F/nm3/63hMo/mrgj49nEYjJ6+MU3LuMdpXYZBxmk6T8MUqV7lM9zSS1ju9qBr8dXS/AZhvrtw37KaS/TFra7lqnaL7hTxrGXDjei15m6Ujf5C6faeUjDltDbAAAAAElFTkSuQmCC',
        facebook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsOFgwledlgLAAAAEVpVFh0Q29tbWVudAAAAAAAQ1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAKqozFDgAAAUdJREFUOMudUTFuwkAQnF1Mc4oULCBIfIAP8I/0/CRfiARlIDTp6ZGgoUM8gAcg0UUEgSwZG87cpHNCgo3FSNfszO7szQLAA4CeiIQAWOSJSATgTUQeAaBXtPHKoHcRkZCkwQ202234vo9SqYTZbIbT6QRV/UQRp/F4zM1mw+12S2sta7Xabz6/eTAY8C/q9XrKe7dW73Q6AIDVaoXJZAJjDKIoutBkujcaDQZBwPP5zG63m6X7X6xWqxwOh5zP57TW0jnH9XrN6XTKxWLBSqWSP6DZbHK5XDILvzPQa/92ziEIAoRhCJIAgOPxiP1+D5JpLTMDVaUxhq1WK82g3++zXC7T932KSP4VnHM4HA6pIwDEcQxrLXa73YVW806o+kOLyHWNiMS4E57nfSnJj3sHJEky8kTkBYAnIs/OuaeizkmSjFT19RsTVx1AmuGwVgAAAABJRU5ErkJggg==',
    };

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
                  .then(({them: [{proofs_summary: {all}, basics: {username}}]}) => [{
                      nametag: username,
                      service_url: `https://keybase.io/${username}`,
                      proof_type: 'keybase',
                  }, ...all])
            );
        }
        return users.get(username);
    };
    const getProfileInfo = () => {
        const user = document.querySelector('.ProfileHeaderCard-screenname b').innerText;
        const element = document.querySelector('.ProfileHeaderCard-screenname:not(.proven)');
        if (!element) return;
        element.classList.add('proven');
        getUser(user)
            .then((proofs) => proofs.map(({proof_type, nametag, service_url}) => {
            if (proof_type === 'twitter') return;
            element.innerHTML +=`
              <br/>
              <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
                  <b><img src="${icons[proof_type]}"/> ${nametag}</b>
              </a>
        `;
        }));
    };
    window.setInterval(getProfileInfo, 1000);
})();
