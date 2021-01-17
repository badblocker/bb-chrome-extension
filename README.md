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
    └── blocker.tsx
```
* `background.ts` persistently checks for webpages that come in and maps them to the right path (block or not)
* `index.css` pulls in tailwinds and any other css files 
* `matcher.ts` attempts to use the same matching algorithm as the `WebRequest Filter` core library
* `searchList.ts` is the list of formatted search params for the filter to match against
* `recordList.ts` is the in-memory database of all sites to be blocked.

