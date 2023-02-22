// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: __uv$config.prefix
  }).then(function(registration) {
    console.log('Service worker registered with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed: ', err);
  });
}

// Optional: add an event listener to check when the service worker is installed
navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SW_INSTALLED') {
    console.log('Service worker installed!');
  }
});

// Optional: add an event listener to check when the service worker is activated
navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SW_ACTIVATED') {
    console.log('Service worker activated!');
  }
});

function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};

