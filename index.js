const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
const pLimit = require('p-limit');
const urlStep = 10;
const domainStep = 1;
const maxDomainsToRequest = 3;
const limitByUrl = pLimit(urlStep);
const limitByDomain = pLimit(domainStep);

const server = http.createServer((req, res) => {
  const fileUrls =  ['google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1', 'google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1', 'google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1', 'google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1','google.com/1', 'google.com/2', 'yandex.com/1'];
  let urlStepDomains = {};

  function downloadFile (url, domain) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('file downloaded ' + domain);
        resolve();
      }, 1000);
    });
  }

  function domainLimit (url) {
    const domain = url.split('/')[0];

    if (urlStepDomains[domain]) {
      urlStepDomains[domain]++;
    } else {
      urlStepDomains[domain] = 1;
    }

    if (urlStepDomains[domain] % maxDomainsToRequest === 0) { //
      return limitByDomain(() => downloadFile(url, domain));
    }
    return downloadFile(url, domain);
  }

  Promise.all(fileUrls.map((url, index) => {
    if (index % urlStep === 0) {
      urlStepDomains = {};
    }
    return limitByUrl(() => domainLimit(url));
  })).then(() => {
    console.log("done");
  }).catch(error => {
    console.log(error);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
