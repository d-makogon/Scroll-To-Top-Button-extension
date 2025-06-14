// Service worker runs in a worker context without DOM APIs.
// Some of the imported legacy scripts expect a global `window` and
// `document` object to exist which normally isn't available in a
// service worker. When these objects are missing the scripts throw
// runtime errors and the service worker fails to start, showing as
// "inactive" in the browser.  Stub minimal versions so the scripts can
// execute without errors.
if (typeof window === 'undefined') {
  self.window = self;
}

// Some of the legacy code relies on XMLHttpRequest which is not available
// in a service worker. Provide a very small fetch-based polyfill that
// implements just the features required by i18next's XHR backend.
if (typeof self.XMLHttpRequest === 'undefined') {
  self.XMLHttpRequest = class {
    constructor() {
      this.headers = {};
      this.readyState = 0;
      this.responseText = '';
      this.status = 0;
      this.onreadystatechange = null;
    }

    open(method, url, async = true) {
      this.method = method;
      this.url = url;
      this.async = async;
      this.readyState = 1;
    }

    setRequestHeader(name, value) {
      this.headers[name] = value;
    }

    async send(data) {
      try {
        const response = await fetch(this.url, {
          method: this.method,
          headers: this.headers,
          body: data,
        });
        this.status = response.status;
        this.responseText = await response.text();
      } catch (err) {
        this.status = 0;
        this.responseText = '';
      }

      this.readyState = 4;
      if (typeof this.onreadystatechange === 'function') {
        this.onreadystatechange();
      }
    }
  };
}

// Provide a minimal fake document to satisfy legacy modules.
if (typeof self.document === 'undefined') {
  const dummyElement = () => ({
    append: () => {},
    appendChild: () => {},
    setAttribute: () => {},
    classList: { add: () => {}, remove: () => {} },
  });

  self.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: dummyElement,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: dummyElement(),
  };
}

// Firefox exposes `browser.action` instead of `browser.browserAction`.
if (self.browser && self.browser.action && !self.browser.browserAction) {
  self.browser.browserAction = self.browser.action;
}

importScripts(
  chrome.runtime.getURL('global/js/browser-polyfill.min.js'),
  chrome.runtime.getURL('global/js/bowser.js'),
  chrome.runtime.getURL('global/js/punycode.min.js'),
  chrome.runtime.getURL('global/js/global.js'),
  chrome.runtime.getURL('global/js/event.js'),
  chrome.runtime.getURL('global/js/utils.js'),
  chrome.runtime.getURL('global/js/const.js'),
  chrome.runtime.getURL('global/js/log.js'),
  chrome.runtime.getURL('global/js/i18next/i18next.min.js'),
  chrome.runtime.getURL('global/js/i18next/i18nextXHRBackend.js'),
  chrome.runtime.getURL('shared/legacy/i18n.js'),
  chrome.runtime.getURL('shared/legacy/context-menus.js'),
  chrome.runtime.getURL('shared/legacy/background.js'),
  chrome.runtime.getURL('background.js')
);

