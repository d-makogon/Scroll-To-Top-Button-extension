if (typeof window === 'undefined') {
  self.window = self;
}

if (self.browser && self.browser.action && !self.browser.browserAction) {
  self.browser.browserAction = self.browser.action;
}

importScripts(
  'global/js/browser-polyfill.min.js',
  'global/js/bowser.js',
  'global/js/punycode.min.js',
  'global/js/global.js',
  'global/js/event.js',
  'global/js/utils.js',
  'global/js/const.js',
  'global/js/log.js',
  'global/js/i18next/i18next.min.js',
  'global/js/i18next/i18nextXHRBackend.js',
  'shared/legacy/i18n.js',
  'shared/legacy/context-menus.js',
  'shared/legacy/background.js',
  'background.js'
);

