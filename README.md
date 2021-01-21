# BadBlocker Chrome Extension

## Get started

Clone the repo and run the following:

1. `npm install`
2. `npm start`

The extension will be packed (via webpack) into the `dist/` folder.  TailwindsCSS is included for utility classes.
## Source Structure

```
src
├── app
│   ├── background.ts
|   ├── searchList.ts
|   ├── recordList.ts
|   └── matcher.ts
├── styles
│   └── index.css
├── img
│   └── background.png
└── ui
    └── main.tsx
```
* `background.ts` persistently checks for webpages that come in and maps them to the right path (block or not)
* `index.css` pulls in tailwinds and any other css files 
* `matcher.ts` attempts to use the same matching algorithm as the `WebRequest Filter` core library
* `searchList.ts` is the list of formatted search params for the filter to match against
* `recordList.ts` is the in-memory database of all sites to be blocked.



## Permission Justifications

* `single-purpose` Intercept a user's web traffic to remind the user of the credible and published reports of unethical actions of the corporation or website the user is visiting.  User may proceed once, proceed permanently, or divert to an alternative as they see fit. 
* `storage` In order to pass state back and forth between the background process and extension options window (where the majority of display work happens), the `storage` option is required.
* `webRequest` This extension works by intercepting the webRequest, matching the domain to a blocklist, and then directing the user to an interstitial page within the extension.  Without the webRequest permission, the user will not able to use the extension as intended.
* `webRequestBlocking` While the extension could be used as an overlay on top of an existing site, that would require in-page modification of a user's tab and would also still allow the user's traffic to be recognized by the "blocked" website.  By blocking prior to the send, the user doesn't share tracking and traffic data with the website (the intent here), and the extension does not interfere with any other website's code (which can be more cumbersome and dangerous)
* `Host` Because this extension "politely" intercepts traffic from other websites to check the blocklist status, a broad host match pattern is required.  Currently the app only intends to intercept http(s) protocols and thus does not need the `<all_urls>` permission.  Given the risk of this interception, all code for this extension is maintained as open-source and available here: https://github.com/badblocker/bb-chrome-extension.
* `Remote Code` There is one json file loaded offsite, in order to keep the blocklist more up-to-date than the extension update cycle allows. This file is hosted on github in the repo.  It is publicly available, along with all the code.  There is no "home server," and there are no tracking calls except to standard Google Analytics.  No data leaves the user's device unless you include the GET headers in the request to Github, which we have no access to.  