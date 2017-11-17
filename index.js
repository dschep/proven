(function () {
  'use strict';

  const getStyle = () => {
    const styleSheetNames = new Set(Array.from(document.styleSheets).map(({ href }) => href && href.split('/').pop()));
    if (styleSheetNames.has('nightmode_twitter_core.bundle.css'))
      return 'height:12px;';
    return 'height:12px;';
  };

  const icons = {
    keybase: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABVpJREFUSMfNVWtsFFUYXQ0/+8OQmKC0uzuzszs7s6/ZnV36gC2gQOuKUFqKXR6lUqVAqdAKEWkMVWkjohALJA2P7m7Lq76IokYBgwSjYbUlFNvIDyLBVmgrfdPS5/HeO22RBBWNP5zk23z7zZ1zznfuN3d0uv/JNUmS+I2TJ+vi/hM0o9FotZpMETHO+LGJM5WKorhdttkgZWxea983IMXtuf24ruTspH9NYDGZTrgWzIa6OQjH3OkwC2ZwsgvWvMp+144r/WoEbe7w6EV31ci7ntCQ/58TcNwlb9kqxIeKIAVTkO3jUfykCXNdHGS7A3KwBN7wMHzHAXcII57I6EnHgUH1gcA9lYN58oxFt52ZfnheCUJy2RBdwQMvcehdb8Q3y3j4pamQs3dCrQZIN/AdBc07fZUjq/8GfKTQe4Soev0HyE8EITjikeoW0LeeEGwcC0L0UboBJpUIqOhkBGoY8FYBnmqMUoz7gisHkUZUDNGFTBlRJeVXI02Jw1ABBxQS8CKNoCGHg+jywV3+K9QqjWCchGJQrHvAbft6pxAvr3mr7y72EH9dJd/CIVlwaSWHK7k8Cv0Cvg7y2BPgYVSS4N71M9QjmOiCkVSzfblGMScIvAdHtvuOjS2KaB04t56B4F8EyWpBssuMFIVMUvApuBLdmCab4XeawSsJkHPegXqgR+t6jIRiUUxt5nd3POKuHFNPwUODkJa/CZtVQOkcAxpX8dgVEOC3m2GfPxNKWS6SXBLqV/I4ksaRDY+FMHMxlHevT5CwLggmxdYpIQSYdxQ8Mgzx2RIkSnqcW8ppnhdqvn+/nIMt3g3v26th35SFVQkChjZwuJ7HY5lXD1P8PKh7mu6SEEyKrfOGUMXUHwbs+VVQrUbUZo9t6AYeXfkcm572tRxmEOWe3WuRdOoNcPNn4/AzRmATh458Hks8cTCn5BIHhjQCgkexdWRDmiiru7wJJlc8jqYZJ5TXpAsaGcmHidqNsywwZqbA7vfB57PjbFDQOiTR+BwPxWqAc8uXTCx1hGLrSDJEC1LuPjaSAwWaNScyTVjgtaA336jNPwHpXscjFODw3VIeN/K0zmiXLEi+fJoewrwc0sGwNokhDOrIz29qaBim5AxUBPTAZg5nyCiaRRFlKQL7jxeNzKJrz3P45QUebWs43Fk/RlCkRV8Bj1SFh0lyauNLXQmjhVg0+olnbwt7cX7MMeICORZckhkCIThGLNobMCBd0SPBZoLqkFh47SJm2Tnk+GJRnqpHZKEBS9U4JE6fAa/bCefLn8NLRtVTOfqhTjk0sEzZ+RPinRZ8kMEjicx3AlloEXg4RHLABeaj7K2dOPnpZ7gQjaK27iLOnT+Po8drsOXVbVi4eAnmpAZQUFiE2tpaZCwIQFpzCGoNG9XFuqnlfbHObedvuGQLFEnAlq3FyM5egeSZyah57320t7eDXv39/ejt7WXR19fHagMDA+js7GRraK2rqwsZCwOQ10XoBncI5T2P0nftIcea/XtEWUZCYiKi0QsoLd2Oq1evEoBBXL58GRUVFWhqamJgNJqbm1mtvr4e3d3d6OjoYPWbN29i7uxkMklfwBnC/omjgpekp0VRqJVluef06VPo6elhaqjacDgMUbSgrq6OgdE6zWmN3qNrbt26xeqU0OP1wflatNW6/45lgsBgMDxGPpNT9PqpXxUXb2XtjqtqaWlBQ0MDs2G8A5o3Njaye+M1amF1JEyO8Vlw7mjMve+RbTDEprvdSlM0Gm0mIM1tbW0s/pj/Wa21tbU5KyurWW9TD+hKSh7+q+9OTGZmZgzZwxjy0AMH6TKGPkviHvDfAfP3QgC9zTf5AAAAAElFTkSuQmCC',
    hackernews: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUarR2LJgAAAKNJREFUOMvFkzsOwyAQRB8hd+IGew9aSxRIyKUVn863cUVDtSkiWfEnGMWKMhXMrnZmxGIA5QJuXMRqQAgBVWUcx12j9x5VJYSw4s02gurraoyhhd9F6PsegGEYFq7rulWt6uBI7ZM6gAUeWzLnjIhQSsE5h4iQUmKapjYH76pL44F69RljjIfnZgdn2ZsWaRvj95v4De614jzPWGurA8zff+MTlW89eZm3DJYAAAAASUVORK5CYII=',
    reddit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUIXqT6bgAAAU1JREFUOMut0r9L1lEYBfDPa6++oCAuDtEoQRBRg+Bgw0u9gTYZhS415lCDiOIouQr+AW1REESDOjgIZrlJRFJIBOniJIIV+AvRxOUI30HohXqWy733Oeeec57LP9aFOvva0YgKnuE+vuNXQx3g5/iCdazhErYwW8/LnQFVonYJj3Edv/8GbsAw3hasdmMTOyFSRhMeog1z6EM/rmA33vfwFS9QSwblKPMa77GIk3i7g+aCmhbcxgz+4APe4Y3IqSaYuwE0nWOpkrUnvVXsw8uQjKbhHg7xqAAewFHuYCSYV2c5bONyIagf6C0Q1DKNm9l34GewYCXAequKT8WDYSzEZwnLGAtpDRP4mNFWEuKQNJ/ZmEYrBrN/gmtJ/XOy2svP3MUDHJUKKsp4inF8y1g3cICr6MINTGEyxErn+GvGrci/iOMQrWI+Kv5fnQI3V0l+bKwI4gAAAABJRU5ErkJggg==',
    twitter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQQtDLsfaAAAASFJREFUOMu10jFrVUEQBeBvZo1IUPIKLQQbixSp7FQIom3SWMXq/Yr0/gILm5TpAklrrSkULMTqYSNpDcQimATUYNDnWuRGLsm7lwfigWGH2TnnLDPLP6JM2XeT8oS4Rz3CQVO/BjfIpz3kRyEPQ9YmfqRcC+U1FlCWQtaUz3HlHDlDfmqRW1Hek6twt3XxkbKCy43A/GRy1pSbmIEI5d25hv0QL1KudwmczoRLWOT3F6IiGufrxOPaO9fx57NsEPKgy6kjTnAVEkdVDPF1+u3XbXxrV2ZTboT8Oc0L8PDvmprzGLvNTHoRbOFN18dcDvGyx32EuQ5hd1I+C/l9MjleYTCJ/CCUtz2uHyjD1oovOJ/hNuU+9RZ+EXuMR9jxP/EHGLBvXbXVSZYAAAAASUVORK5CYII=',
    github: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUQTchiOAAAAR9JREFUOMut00srxWEQBvDfOe6S20kJ5ZIUK4WFlYWUPZ2ifAkbn0DKp7Cycdkp2SK3RKKsSHZsSHJcis2oNwvp5K3p/T8zzzz/mekd/ukMYQmjyPzCy2AMyxhMA/P4DNvHCDowENYV4ocJbyEVWEkCf7V1yIZAUxFtN39/tOC5iAoK6CzBIoaLqKAUdRlcoTOcBVziISZekyS8oBL9kQy38BolXaP1D39uw1nShvsA+SDMYge5JKke25gLnI+cG9gK0JeU9YnpRGAyfHeBewNvZrEazu64T/GB80TgAm84Cfw9szUoxzH2UI2qhJCe9ohXYBdHKMuG8jie4hnPRM85NITl0Iip4DzGTrz/XJxBTKAHtT9izzH9DRz81xb7AsfEVvjNe2/cAAAAAElFTkSuQmCC',
    generic_web_site: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUBJ3hCygAAAR9JREFUOMul07suBFAQBuCPhGpb2q3XpUO9pZJXcElcHkGJDrtLbDyAN6ASote61Ao6GqsRy2r+lc3uRohJJpkz/z/nzMyZoVcmUMUNXqM3qGDcDzKMQ3yghTdsYit2C00chNsTfIGXvP6JlQ58Lb5qOOfdl9QDTOEI9xjswAfjq2MGDey3wcmktpDzI45Rxly0HN9DOEuJGZO0nrCBq9T6k16F+4xduAvQwGXsWRRRiBbja4XTiH0thxOMYD5Aoc8vFYLNYxSneGk3aiD6F/nm3/63hMo/mrgj49nEYjJ6+MU3LuMdpXYZBxmk6T8MUqV7lM9zSS1ju9qBr8dXS/AZhvrtw37KaS/TFra7lqnaL7hTxrGXDjei15m6Ujf5C6faeUjDltDbAAAAAElFTkSuQmCC',
    dns: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QsMAQUBJ3hCygAAAR9JREFUOMul07suBFAQBuCPhGpb2q3XpUO9pZJXcElcHkGJDrtLbDyAN6ASote61Ao6GqsRy2r+lc3uRohJJpkz/z/nzMyZoVcmUMUNXqM3qGDcDzKMQ3yghTdsYit2C00chNsTfIGXvP6JlQ58Lb5qOOfdl9QDTOEI9xjswAfjq2MGDey3wcmktpDzI45Rxly0HN9DOEuJGZO0nrCBq9T6k16F+4xduAvQwGXsWRRRiBbja4XTiH0thxOMYD5Aoc8vFYLNYxSneGk3aiD6F/nm3/63hMo/mrgj49nEYjJ6+MU3LuMdpXYZBxmk6T8MUqV7lM9zSS1ju9qBr8dXS/AZhvrtw37KaS/TFra7lqnaL7hTxrGXDjei15m6Ujf5C6faeUjDltDbAAAAAElFTkSuQmCC',
    facebook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QsOFgwledlgLAAAAEVpVFh0Q29tbWVudAAAAAAAQ1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gOTAKqozFDgAAAUdJREFUOMudUTFuwkAQnF1Mc4oULCBIfIAP8I/0/CRfiARlIDTp6ZGgoUM8gAcg0UUEgSwZG87cpHNCgo3FSNfszO7szQLAA4CeiIQAWOSJSATgTUQeAaBXtPHKoHcRkZCkwQ202234vo9SqYTZbIbT6QRV/UQRp/F4zM1mw+12S2sta7Xabz6/eTAY8C/q9XrKe7dW73Q6AIDVaoXJZAJjDKIoutBkujcaDQZBwPP5zG63m6X7X6xWqxwOh5zP57TW0jnH9XrN6XTKxWLBSqWSP6DZbHK5XDILvzPQa/92ziEIAoRhCJIAgOPxiP1+D5JpLTMDVaUxhq1WK82g3++zXC7T932KSP4VnHM4HA6pIwDEcQxrLXa73YVW806o+kOLyHWNiMS4E57nfSnJj3sHJEky8kTkBYAnIs/OuaeizkmSjFT19RsTVx1AmuGwVgAAAABJRU5ErkJggg==',
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
          .then(({ them: [{ proofs_summary: { all }, basics: { username } }] }) => [{
            nametag: username,
            service_url: `https://keybase.io/${username}`,
            proof_type: 'keybase',
          }, ...all])
      );
    }
    return users.get(username);
  };

  const getProfileInfo = () => {
    let user;
    const element = document.querySelector('.ProfileCard-screenname:not(.proven),.ProfileHeaderCard-screenname:not(.proven)');
    if (element) {
      user = element.querySelector('b').innerText;
      element.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs.map(({ proof_type, nametag, service_url }) => {
          if (proof_type === 'twitter') return;
          element.innerHTML += `
          <br/>
          <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
          <b><img style="${getStyle()}" src="${icons[proof_type]}"/> ${nametag}</b>
          </a>
          `;
        }));
    }
    const mobileElement = document.querySelector('._2CFyTHU5:not(.proven)');
    if (mobileElement) {
      user = mobileElement.querySelector('.Z5IeoGpY').innerText.replace('@', '');
      mobileElement.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs.map(({ proof_type, nametag, service_url }) => {
          if (proof_type === 'twitter') return;
          mobileElement.innerHTML += `<br><span class="rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-6gldlz rn-1471scf rn-1lw9tu2 rn-ogifhg rn-7cikom rn-1it3c9n rn-ad9z0x rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bauka4 rn-irrty rn-qvutc0"><a href="${service_url}" style="" class=""><img style="${getStyle()}" src="${icons[proof_type]}"/> ${nametag}</a></span>`;
        }));
    }
  };
  window.setInterval(getProfileInfo, 1000);
  const getTweetInfo = () => {
    Array.from(document.querySelectorAll('.account-group:not(.proven), ._3Qd1FkLM div:not(.proven)'))
      .map(element => {
        element.classList.add('proven');
        const user = element.querySelector('.username b') ? element.querySelector('.username b').innerText : element.innerText.replace('@', '');
        const target = element.querySelector('.UserBadges') || element;
        getUser(user)
          .then((proofs) => proofs.map(({ proof_type, nametag, service_url }) => {
            if (proof_type != 'keybase') return;
            target.innerHTML += `
            <a href="${service_url}" title="${nametag}"><img style="${getStyle()}" src="${icons[proof_type]}"/></a>
            `;
          }));
      });
  };
  window.setInterval(getTweetInfo, 1000);
})();
