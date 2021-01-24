/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app/alarm.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app/alarm.ts":
/*!**************************!*\
  !*** ./src/app/alarm.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storageChrome_1 = __webpack_require__(/*! ./storageChrome */ "./src/app/storageChrome.ts");
const background_1 = __webpack_require__(/*! ./background */ "./src/app/background.ts");
let recordList = __webpack_require__(/*! ./recordList.json */ "./src/app/recordList.json");
let searchList = __webpack_require__(/*! ./searchlist.json */ "./src/app/searchlist.json");
var opt_extraInfoSpec = [
    "blocking",
    "requestBody"
];
function getList(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://raw.githubusercontent.com/badblocker/bb-chrome-extension/main/src/app/${name}List.json`;
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "text/plain");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let newList = yield fetch(url, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('error', error));
        //   console.log(newList)
        return newList;
    });
}
// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup....');
    startRequest();
});
// alarm listener
chrome.alarms.onAlarm.addListener(alarm => {
    // if watchdog is triggered, check whether refresh alarm is there
    if (alarm && alarm.name === 'watchdog') {
        chrome.alarms.get('refresh', alarm => {
            if (alarm) {
                console.log('Refresh alarm exists. Yay.');
            }
            else {
                // if it is not there, start a new request and reschedule refresh alarm
                console.log("Refresh alarm doesn't exist, starting a new one");
                startRequest();
                scheduleRequest();
            }
        });
    }
    else {
        // if refresh alarm triggered, start a new request
        startRequest();
    }
});
// schedule a new fetch every 30 minutes
function scheduleRequest() {
    console.log('schedule refresh alarm to 30 minutes...');
    chrome.alarms.create('refresh', { periodInMinutes: 2 });
}
// schedule a watchdog check every 5 minutes
function scheduleWatchdog() {
    console.log('schedule watchdog alarm to 5 minutes...');
    chrome.alarms.create('watchdog', { periodInMinutes: 1 });
}
// fetch data and save to local storage
function startRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('start HTTP Request...');
        yield getList('record').then(list => {
            storageChrome_1.localSyncSet({
                '__recordList': JSON.stringify(list)
            });
            console.log('recordList Refreshed');
        });
        yield getList('search').then(list => {
            storageChrome_1.localSyncSet({
                '__searchList': JSON.stringify(list)
            });
            console.log('searchList Refreshed');
        });
        chrome.webRequest.onBeforeRequest.removeListener(background_1.callback);
        // console.log('Adding filter listener')
        chrome.webRequest.onBeforeRequest.addListener(background_1.callback, background_1.filter(), opt_extraInfoSpec);
    });
}
// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');
    scheduleRequest();
    scheduleWatchdog();
    startRequest();
});


/***/ }),

/***/ "./src/app/background.ts":
/*!*******************************!*\
  !*** ./src/app/background.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.callback = void 0;
const matcher_1 = __importDefault(__webpack_require__(/*! ./matcher */ "./src/app/matcher.ts"));
const storageChrome_1 = __webpack_require__(/*! ./storageChrome */ "./src/app/storageChrome.ts");
let recordList = __webpack_require__(/*! ./recordList.json */ "./src/app/recordList.json");
let searchList = __webpack_require__(/*! ./searchlist.json */ "./src/app/searchlist.json");
let preferenceList = {};
let cacheStamp = Date.now();
/*
site: http://www.redzeppelinpizza.com/Menu.html
check: redzeppelinpizza.com TRUE
check: www.redzeppelinpizza.com TRUE
check: www.redzeppelinpizza.com/Menu.html TRUE
checkL www.redzeppelinpizza.com/Home.html FALSE
*/
/*
site: https://webpack.js.org/configuration
check: webpack.js.org/configuration/watch TRUE
check: webpack.js.org/contribute FALSE
check: webpack.js.org TRUE
*/
/**
 * Callback is the function that the webRequest interruptions are sent to, provided they pass the filter
 * This function assumes a match has been made
 * @param details the webRequest Details object passed into the default Callbak Function
 */
exports.callback = function (details) {
    // console.log('callback', details)
    // console.log('pre', searchList)
    refreshLists();
    // use the lists to run your checks
    let key = matchUrl(details.url, searchList);
    // if there is no match
    if (key < 0) {
        return { cancel: false };
    }
    let { domain, ignoreUntil } = getDomainAndIgnore(key, searchList, preferenceList);
    // console.log(domain, key, ignoreUntil)
    // if ignoreUntil is still in effect, carry on.
    if (!!ignoreUntil && Date.now() < ignoreUntil) {
        return { cancel: false };
    }
    // else block the page  
    let original = encodeURIComponent(details.url);
    return { redirectUrl: `chrome-extension://${chrome.runtime.id}/index.html#/block?key=${domain}&original=${original}` };
};
function filter() {
    searchList = JSON.parse(storageChrome_1.localSyncGet('__searchList')) || searchList;
    if (Object.keys(searchList).length <= 0) {
        return { urls: ['*://example.com/'] };
    }
    var searchListArray = Object.keys(searchList).map(url => `*://${url}`);
    var filter = { urls: searchListArray };
    return filter;
}
exports.filter = filter;
// Attach the alarms to the 
function matchUrl(url, searchList) {
    let searchable = Object.keys(searchList);
    let key = searchable.findIndex(pattern => {
        // This attempts to use the same matching algorithm as chrome so we can find out 
        // which record is the one we're looking at
        let regex = matcher_1.default('*://' + pattern);
        return (url).match(regex);
    });
    // console.log('key',key)
    return key;
}
function getDomainAndIgnore(key, searchList, timeoutList) {
    let domain = searchList[Object.keys(searchList)[key]] || "";
    let ignoreUntil = timeoutList[domain] || null;
    return { domain, ignoreUntil };
}
function refreshLists() {
    // Make sure lists are up-to-date
    // Only refresh this list every hour to keep the callback lightweight  
    if (Date.now() > cacheStamp + 1000 * 60 * 60) {
        recordList = JSON.parse(storageChrome_1.localSyncGet('__recordList')) || recordList;
        searchList = JSON.parse(storageChrome_1.localSyncGet('__searchList')) || searchList;
        preferenceList = JSON.parse(storageChrome_1.localSyncGet('__preferenceList')) || preferenceList;
    }
}


/***/ }),

/***/ "./src/app/matcher.ts":
/*!****************************!*\
  !*** ./src/app/matcher.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//https://github.com/bb010g/match-pattern-to-regexp
/**
 * Transforms a valid match pattern into a regular expression
 * which matches all URLs included by that pattern.
 *
 * @param  {string}  pattern  The pattern to transform.
 * @return {RegExp}           The pattern's equivalent as a RegExp.
 * @throws {TypeError}        If the pattern is not a valid MatchPattern
 */
function matchPatternToRegexp(pattern) {
    if (pattern === '') {
        return /^(?:http|https|ws|wss|file|ftp|ftps):\/\//;
    }
    const schemeSegment = '(\\*|http|https|ws|wss|file|ftp|ftps)';
    const hostSegment = '(\\*|(?:\\*\\.)?(?:[^/*]+))?';
    const pathSegment = '(.*)';
    const matchPatternRegExp = new RegExp(`^${schemeSegment}://${hostSegment}/${pathSegment}$`);
    const match = matchPatternRegExp.exec(pattern);
    if (!match) {
        throw new TypeError(`"${pattern}" is not a valid MatchPattern`);
    }
    let [, scheme, host, path] = match;
    if (!host && scheme !== 'file') {
        throw new TypeError(`"${pattern}" does not have a valid host`);
    }
    const schemeRegex = scheme === '*' ? '(http|https|ws|wss)' : scheme;
    let hostRegex = '';
    if (host) {
        if (host === '*') {
            hostRegex = '[^/]+?';
        }
        else {
            if (host.startsWith('*.')) {
                hostRegex = '(?:[^/]+?\\.)?';
                host = host.substring(2);
            }
            hostRegex += host.replace(/\./g, '\\.');
        }
    }
    let pathRegex = '/?';
    if (path) {
        if (path === '*') {
            pathRegex = '(/.*)?';
        }
        else if (path.charAt(0) !== '/') {
            pathRegex = `/${path.replace(/\./g, '\\.').replace(/\*/g, '.*?')}`;
        }
    }
    const regex = `^${schemeRegex}://${hostRegex}${pathRegex}$`;
    return new RegExp(regex);
}
exports.default = matchPatternToRegexp;


/***/ }),

/***/ "./src/app/recordList.json":
/*!*********************************!*\
  !*** ./src/app/recordList.json ***!
  \*********************************/
/*! exports provided: redzeppelinpizza.com, example.com, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"redzeppelinpizza.com\":{\"name\":\"Red Zeppelin Pizza\",\"issues\":[{\"text\":\"support of insurrection\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]},{\"text\":\"white supremacy\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]},{\"text\":\"vote suppression & election corruption\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]}],\"alternatives\":[{\"name\":\"Phat Boy'z Pizza1\",\"reason\":\"A Black Owned Business\",\"link\":\"https://www.seamless.com/menu/phat-boyz-pizza-9186-greenwell-spring-rd-baton-rouge/273543\"},{\"name\":\"Phat Boy'z Pizza2\",\"reason\":\"Black Owned Business\",\"link\":\"https://www.seamless.com/menu/phat-boyz-pizza-9186-greenwell-spring-rd-baton-rouge/273543\"}]},\"example.com\":{\"name\":\"Example.com\",\"issues\":[{\"text\":\"support of insurrection\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]},{\"text\":\"white supremacy\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\",\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]},{\"text\":\"vote suppression & election corruption\",\"links\":[\"https://www.brproud.com/news/local-news/social-media-calls-for-boycott-of-rouses-and-red-zeppelin-pizza-following-owners-photographed-at-rally-at-u-s-capitol/\"]}],\"alternatives\":[{\"name\":\"Prototype.com\",\"reason\":\"A Better non-existent Website\",\"link\":\"https://www.seamless.com/menu/phat-boyz-pizza-9186-greenwell-spring-rd-baton-rouge/273543\"}]}}");

/***/ }),

/***/ "./src/app/searchlist.json":
/*!*********************************!*\
  !*** ./src/app/searchlist.json ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module) {

module.exports = JSON.parse("{}");

/***/ }),

/***/ "./src/app/storageChrome.ts":
/*!**********************************!*\
  !*** ./src/app/storageChrome.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.localSyncSet = exports.localSyncGet = exports.localAsyncSet = exports.localAsyncGet = void 0;
exports.localAsyncGet = (key) => {
    // console.log('getKey',key)
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key]);
        });
    }).catch(e => {
        // console.log(e)
        return null;
    });
};
exports.localAsyncSet = (object) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(object, () => {
            resolve(object);
        });
    }).catch(e => {
        // console.log(e)
        return null;
    });
};
exports.localSyncGet = (key) => {
    // console.log('getSync Key',key)
    let result = localStorage.getItem(key);
    return result;
};
exports.localSyncSet = (object) => {
    // console.log('setSync Object',Object.keys(object)[0], object[Object.keys(object)[0]])
    let stored = object[Object.keys(object)[0]];
    if (typeof stored != 'string') {
        throw new Error('localSyncSet must set a string key and value.  Use JSON.stringify if object storage is needed.');
    }
    let result = localStorage.setItem(Object.keys(object)[0], object[Object.keys(object)[0]]);
    return result;
};


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9hbGFybS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9tYXRjaGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc3RvcmFnZUNocm9tZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsaUdBQTBEO0FBQzFELHdGQUErQztBQUcvQyxJQUFJLFVBQVUsR0FBRyxtQkFBTyxDQUFDLG9EQUFtQixDQUFDO0FBQzdDLElBQUksVUFBVSxHQUFHLG1CQUFPLENBQUMsb0RBQW1CLENBQUM7QUFDN0MsSUFBSSxpQkFBaUIsR0FBRztJQUNwQixVQUFVO0lBQ1YsYUFBYTtDQUNoQixDQUFDO0FBRUYsU0FB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WSxxQkFBYSxHQUFHLENBQUMsTUFBTSxFQUFDLEVBQUU7SUFDbkMsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsRUFBRTtRQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLEdBQUUsRUFBRTtZQUNoQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ25CLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUU7UUFDUixpQkFBaUI7UUFDakIsT0FBTyxJQUFJO0lBQ2YsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUlZLG9CQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUMvQixpQ0FBaUM7SUFDakMsSUFBSSxNQUFNLEdBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDM0MsT0FBTyxNQUFNO0FBQ2pCLENBQUM7QUFFWSxvQkFBWSxHQUFHLENBQUMsTUFBTSxFQUFDLEVBQUU7SUFDbEMsdUZBQXVGO0lBQ3ZGLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLElBQUcsT0FBTyxNQUFNLElBQUksUUFBUSxFQUFDO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0dBQWdHLENBQUM7S0FDcEg7SUFDRCxJQUFJLE1BQU0sR0FBUSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RixPQUFPLE1BQU07QUFDakIsQ0FBQyIsImZpbGUiOiJhbGFybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC9hbGFybS50c1wiKTtcbiIsImltcG9ydCB7bG9jYWxTeW5jU2V0LCBsb2NhbFN5bmNHZXR9IGZyb20gJy4vc3RvcmFnZUNocm9tZSdcbmltcG9ydCB7IGNhbGxiYWNrLCBmaWx0ZXIgfSBmcm9tICcuL2JhY2tncm91bmQnXG5kZWNsYXJlIHZhciByZXF1aXJlOiBhbnlcblxubGV0IHJlY29yZExpc3QgPSByZXF1aXJlKCcuL3JlY29yZExpc3QuanNvbicpXG5sZXQgc2VhcmNoTGlzdCA9IHJlcXVpcmUoJy4vc2VhcmNobGlzdC5qc29uJylcbnZhciBvcHRfZXh0cmFJbmZvU3BlYyA9IFtcbiAgICBcImJsb2NraW5nXCIsXG4gICAgXCJyZXF1ZXN0Qm9keVwiXG5dO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRMaXN0KG5hbWUpe1xuICAgIGxldCB1cmwgPSBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhZGJsb2NrZXIvYmItY2hyb21lLWV4dGVuc2lvbi9tYWluL3NyYy9hcHAvJHtuYW1lfUxpc3QuanNvbmBcbiAgICB2YXIgbXlIZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICBteUhlYWRlcnMuYXBwZW5kKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICBteUhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpblwiKTtcbiAgICBcbiAgICB2YXIgcmVxdWVzdE9wdGlvbnM6b2JqZWN0ID0ge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgIHJlZGlyZWN0OiAnZm9sbG93J1xuICAgIH07XG4gICAgXG4gICAgbGV0IG5ld0xpc3QgPSBhd2FpdCBmZXRjaCh1cmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKCdlcnJvcicsIGVycm9yKSk7XG4gICAgLy8gICBjb25zb2xlLmxvZyhuZXdMaXN0KVxuICAgIHJldHVybiBuZXdMaXN0XG59XG4gXG5cbi8vIGZldGNoIGFuZCBzYXZlIGRhdGEgd2hlbiBjaHJvbWUgcmVzdGFydGVkLCBhbGFybSB3aWxsIGNvbnRpbnVlIHJ1bm5pbmcgd2hlbiBjaHJvbWUgaXMgcmVzdGFydGVkXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXAuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdvblN0YXJ0dXAuLi4uJyk7XG4gICAgc3RhcnRSZXF1ZXN0KCk7XG59KTtcbiAgXG4vLyBhbGFybSBsaXN0ZW5lclxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKGFsYXJtID0+IHtcbiAgICAvLyBpZiB3YXRjaGRvZyBpcyB0cmlnZ2VyZWQsIGNoZWNrIHdoZXRoZXIgcmVmcmVzaCBhbGFybSBpcyB0aGVyZVxuICAgIGlmIChhbGFybSAmJiBhbGFybS5uYW1lID09PSAnd2F0Y2hkb2cnKSB7XG4gICAgICBjaHJvbWUuYWxhcm1zLmdldCgncmVmcmVzaCcsIGFsYXJtID0+IHtcbiAgICAgICAgaWYgKGFsYXJtKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1JlZnJlc2ggYWxhcm0gZXhpc3RzLiBZYXkuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gaWYgaXQgaXMgbm90IHRoZXJlLCBzdGFydCBhIG5ldyByZXF1ZXN0IGFuZCByZXNjaGVkdWxlIHJlZnJlc2ggYWxhcm1cbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlZnJlc2ggYWxhcm0gZG9lc24ndCBleGlzdCwgc3RhcnRpbmcgYSBuZXcgb25lXCIpO1xuICAgICAgICAgIHN0YXJ0UmVxdWVzdCgpO1xuICAgICAgICAgIHNjaGVkdWxlUmVxdWVzdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgcmVmcmVzaCBhbGFybSB0cmlnZ2VyZWQsIHN0YXJ0IGEgbmV3IHJlcXVlc3RcbiAgICAgIHN0YXJ0UmVxdWVzdCgpO1xuICAgIH1cbn0pO1xuXG5cblxuXG4vLyBzY2hlZHVsZSBhIG5ldyBmZXRjaCBldmVyeSAzMCBtaW51dGVzXG5mdW5jdGlvbiBzY2hlZHVsZVJlcXVlc3QoKSB7XG4gICAgY29uc29sZS5sb2coJ3NjaGVkdWxlIHJlZnJlc2ggYWxhcm0gdG8gMzAgbWludXRlcy4uLicpO1xuICAgIGNocm9tZS5hbGFybXMuY3JlYXRlKCdyZWZyZXNoJywgeyBwZXJpb2RJbk1pbnV0ZXM6IDIgfSk7XG59XG4gIFxuXG5cbi8vIHNjaGVkdWxlIGEgd2F0Y2hkb2cgY2hlY2sgZXZlcnkgNSBtaW51dGVzXG5mdW5jdGlvbiBzY2hlZHVsZVdhdGNoZG9nKCkge1xuICAgIGNvbnNvbGUubG9nKCdzY2hlZHVsZSB3YXRjaGRvZyBhbGFybSB0byA1IG1pbnV0ZXMuLi4nKTtcbiAgICBjaHJvbWUuYWxhcm1zLmNyZWF0ZSgnd2F0Y2hkb2cnLCB7IHBlcmlvZEluTWludXRlczogMSB9KTtcbn1cbiAgXG5cblxuLy8gZmV0Y2ggZGF0YSBhbmQgc2F2ZSB0byBsb2NhbCBzdG9yYWdlXG5hc3luYyBmdW5jdGlvbiBzdGFydFJlcXVlc3QoKSB7XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0IEhUVFAgUmVxdWVzdC4uLicpO1xuICAgIGF3YWl0IGdldExpc3QoJ3JlY29yZCcpLnRoZW4obGlzdD0+e1xuICAgICAgICBsb2NhbFN5bmNTZXQoe1xuICAgICAgICAgICAgJ19fcmVjb3JkTGlzdCc6IEpTT04uc3RyaW5naWZ5KGxpc3QpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNvcmRMaXN0IFJlZnJlc2hlZCcpXG4gICAgfSlcbiAgICBhd2FpdCBnZXRMaXN0KCdzZWFyY2gnKS50aGVuKGxpc3Q9PntcbiAgICAgICAgbG9jYWxTeW5jU2V0KHtcbiAgICAgICAgICAgICdfX3NlYXJjaExpc3QnOiBKU09OLnN0cmluZ2lmeShsaXN0KVxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoTGlzdCBSZWZyZXNoZWQnKVxuICAgIH0pXG4gICAgY2hyb21lLndlYlJlcXVlc3Qub25CZWZvcmVSZXF1ZXN0LnJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrKTsgXG4gICAgLy8gY29uc29sZS5sb2coJ0FkZGluZyBmaWx0ZXIgbGlzdGVuZXInKVxuICAgIGNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlUmVxdWVzdC5hZGRMaXN0ZW5lcihcbiAgICAgICAgY2FsbGJhY2ssIGZpbHRlcigpLCBvcHRfZXh0cmFJbmZvU3BlY1xuICAgICk7ICBcbn1cblxuLy8gY3JlYXRlIGFsYXJtIGZvciB3YXRjaGRvZyBhbmQgZnJlc2ggb24gaW5zdGFsbGVkL3VwZGF0ZWQsIGFuZCBzdGFydCBmZXRjaCBkYXRhXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ29uSW5zdGFsbGVkLi4uLicpO1xuICAgIHNjaGVkdWxlUmVxdWVzdCgpO1xuICAgIHNjaGVkdWxlV2F0Y2hkb2coKTtcbiAgICBzdGFydFJlcXVlc3QoKTsgXG59KTtcbiAgIiwiaW1wb3J0IHsgZGF0YSB9IGZyb20gJ2F1dG9wcmVmaXhlcic7XG5pbXBvcnQgbWljcm9tYXRjaCBmcm9tICdtaWNyb21hdGNoJ1xuaW1wb3J0IG1hdGNoUGF0dGVyblRvUmVnZXhwIGZyb20gJy4vbWF0Y2hlcidcbmltcG9ydCB7bG9jYWxTeW5jU2V0LCBsb2NhbFN5bmNHZXR9IGZyb20gJy4vc3RvcmFnZUNocm9tZSdcbmRlY2xhcmUgdmFyIHJlcXVpcmU6IGFueVxuXG5sZXQgcmVjb3JkTGlzdCA9IHJlcXVpcmUoJy4vcmVjb3JkTGlzdC5qc29uJylcbmxldCBzZWFyY2hMaXN0ID0gcmVxdWlyZSgnLi9zZWFyY2hsaXN0Lmpzb24nKVxubGV0IHByZWZlcmVuY2VMaXN0ID0ge31cbmxldCBjYWNoZVN0YW1wID0gRGF0ZS5ub3coKVxuLyogICBcbnNpdGU6IGh0dHA6Ly93d3cucmVkemVwcGVsaW5waXp6YS5jb20vTWVudS5odG1sXG5jaGVjazogcmVkemVwcGVsaW5waXp6YS5jb20gVFJVRVxuY2hlY2s6IHd3dy5yZWR6ZXBwZWxpbnBpenphLmNvbSBUUlVFXG5jaGVjazogd3d3LnJlZHplcHBlbGlucGl6emEuY29tL01lbnUuaHRtbCBUUlVFXG5jaGVja0wgd3d3LnJlZHplcHBlbGlucGl6emEuY29tL0hvbWUuaHRtbCBGQUxTRVxuKi9cblxuLypcbnNpdGU6IGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uZmlndXJhdGlvblxuY2hlY2s6IHdlYnBhY2suanMub3JnL2NvbmZpZ3VyYXRpb24vd2F0Y2ggVFJVRVxuY2hlY2s6IHdlYnBhY2suanMub3JnL2NvbnRyaWJ1dGUgRkFMU0VcbmNoZWNrOiB3ZWJwYWNrLmpzLm9yZyBUUlVFXG4qL1xuXG4vKipcbiAqIENhbGxiYWNrIGlzIHRoZSBmdW5jdGlvbiB0aGF0IHRoZSB3ZWJSZXF1ZXN0IGludGVycnVwdGlvbnMgYXJlIHNlbnQgdG8sIHByb3ZpZGVkIHRoZXkgcGFzcyB0aGUgZmlsdGVyXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgYSBtYXRjaCBoYXMgYmVlbiBtYWRlXG4gKiBAcGFyYW0gZGV0YWlscyB0aGUgd2ViUmVxdWVzdCBEZXRhaWxzIG9iamVjdCBwYXNzZWQgaW50byB0aGUgZGVmYXVsdCBDYWxsYmFrIEZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uKGRldGFpbHMpIHtcbiAgICBcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2snLCBkZXRhaWxzKVxuICAgIC8vIGNvbnNvbGUubG9nKCdwcmUnLCBzZWFyY2hMaXN0KVxuXG4gICAgcmVmcmVzaExpc3RzKClcblxuICAgIC8vIHVzZSB0aGUgbGlzdHMgdG8gcnVuIHlvdXIgY2hlY2tzXG4gICAgbGV0IGtleSA9IG1hdGNoVXJsKGRldGFpbHMudXJsLCBzZWFyY2hMaXN0KVxuICAgIC8vIGlmIHRoZXJlIGlzIG5vIG1hdGNoXG4gICAgaWYoa2V5IDwgMCl7XG4gICAgICByZXR1cm4ge2NhbmNlbDpmYWxzZX1cbiAgICB9XG5cbiAgICBsZXQgeyBkb21haW4sIGlnbm9yZVVudGlsIH0gPSBnZXREb21haW5BbmRJZ25vcmUoa2V5LCBzZWFyY2hMaXN0LCBwcmVmZXJlbmNlTGlzdClcblxuICAgIC8vIGNvbnNvbGUubG9nKGRvbWFpbiwga2V5LCBpZ25vcmVVbnRpbClcbiAgICAvLyBpZiBpZ25vcmVVbnRpbCBpcyBzdGlsbCBpbiBlZmZlY3QsIGNhcnJ5IG9uLlxuICAgIGlmKCEhaWdub3JlVW50aWwgJiYgRGF0ZS5ub3coKSA8IGlnbm9yZVVudGlsKXtcbiAgICAgIHJldHVybiB7Y2FuY2VsOmZhbHNlfVxuICAgIH1cblxuICAgIC8vIGVsc2UgYmxvY2sgdGhlIHBhZ2UgIFxuICAgIGxldCBvcmlnaW5hbCA9IGVuY29kZVVSSUNvbXBvbmVudChkZXRhaWxzLnVybClcbiAgICByZXR1cm4ge3JlZGlyZWN0VXJsOiBgY2hyb21lLWV4dGVuc2lvbjovLyR7Y2hyb21lLnJ1bnRpbWUuaWR9L2luZGV4Lmh0bWwjL2Jsb2NrP2tleT0ke2RvbWFpbn0mb3JpZ2luYWw9JHtvcmlnaW5hbH1gfTtcbiAgXG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIoKXtcbiAgc2VhcmNoTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTeW5jR2V0KCdfX3NlYXJjaExpc3QnKSkgfHwgc2VhcmNoTGlzdFxuICBpZihPYmplY3Qua2V5cyhzZWFyY2hMaXN0KS5sZW5ndGggPD0gMCkge1xuICAgIHJldHVybiB7dXJsczogWycqOi8vZXhhbXBsZS5jb20vJ119XG4gIH1cbiAgdmFyIHNlYXJjaExpc3RBcnJheSA9IE9iamVjdC5rZXlzKHNlYXJjaExpc3QpLm1hcCh1cmw9PmAqOi8vJHt1cmx9YClcbiAgdmFyIGZpbHRlciA9IHt1cmxzOiBzZWFyY2hMaXN0QXJyYXl9XG4gIHJldHVybiBmaWx0ZXIgIFxufVxuXG5cblxuXG4vLyBBdHRhY2ggdGhlIGFsYXJtcyB0byB0aGUgXG5cbmZ1bmN0aW9uIG1hdGNoVXJsKHVybCwgc2VhcmNoTGlzdCl7XG4gIGxldCBzZWFyY2hhYmxlID0gT2JqZWN0LmtleXMoc2VhcmNoTGlzdClcbiAgbGV0IGtleSA9IHNlYXJjaGFibGUuZmluZEluZGV4KHBhdHRlcm49PntcbiAgICAvLyBUaGlzIGF0dGVtcHRzIHRvIHVzZSB0aGUgc2FtZSBtYXRjaGluZyBhbGdvcml0aG0gYXMgY2hyb21lIHNvIHdlIGNhbiBmaW5kIG91dCBcbiAgICAvLyB3aGljaCByZWNvcmQgaXMgdGhlIG9uZSB3ZSdyZSBsb29raW5nIGF0XG4gICAgbGV0IHJlZ2V4ID0gbWF0Y2hQYXR0ZXJuVG9SZWdleHAoJyo6Ly8nK3BhdHRlcm4pO1xuICAgIHJldHVybiAodXJsKS5tYXRjaChyZWdleClcbiAgfSlcbiAgLy8gY29uc29sZS5sb2coJ2tleScsa2V5KVxuICByZXR1cm4ga2V5XG59XG5cbmZ1bmN0aW9uIGdldERvbWFpbkFuZElnbm9yZShrZXksIHNlYXJjaExpc3QsIHRpbWVvdXRMaXN0KXtcbiAgbGV0IGRvbWFpbiA9IHNlYXJjaExpc3RbT2JqZWN0LmtleXMoc2VhcmNoTGlzdClba2V5XV0gfHwgXCJcIlxuICBsZXQgaWdub3JlVW50aWwgPSB0aW1lb3V0TGlzdFtkb21haW5dIHx8IG51bGxcbiAgcmV0dXJuIHsgZG9tYWluLCBpZ25vcmVVbnRpbCB9XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2hMaXN0cygpe1xuICAgIC8vIE1ha2Ugc3VyZSBsaXN0cyBhcmUgdXAtdG8tZGF0ZVxuICAgIC8vIE9ubHkgcmVmcmVzaCB0aGlzIGxpc3QgZXZlcnkgaG91ciB0byBrZWVwIHRoZSBjYWxsYmFjayBsaWdodHdlaWdodCAgXG4gICAgaWYoRGF0ZS5ub3coKSA+IGNhY2hlU3RhbXAgKzEwMDAqNjAqNjApe1xuICAgICAgcmVjb3JkTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTeW5jR2V0KCdfX3JlY29yZExpc3QnKSkgfHwgcmVjb3JkTGlzdFxuICAgICAgc2VhcmNoTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTeW5jR2V0KCdfX3NlYXJjaExpc3QnKSkgfHwgc2VhcmNoTGlzdFxuICAgICAgcHJlZmVyZW5jZUxpc3QgPSBKU09OLnBhcnNlKGxvY2FsU3luY0dldCgnX19wcmVmZXJlbmNlTGlzdCcpKSB8fCBwcmVmZXJlbmNlTGlzdFxuICAgIH1cbn1cbiIsIlxuLy9odHRwczovL2dpdGh1Yi5jb20vYmIwMTBnL21hdGNoLXBhdHRlcm4tdG8tcmVnZXhwXG4vKipcbiAqIFRyYW5zZm9ybXMgYSB2YWxpZCBtYXRjaCBwYXR0ZXJuIGludG8gYSByZWd1bGFyIGV4cHJlc3Npb25cbiAqIHdoaWNoIG1hdGNoZXMgYWxsIFVSTHMgaW5jbHVkZWQgYnkgdGhhdCBwYXR0ZXJuLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gIHBhdHRlcm4gIFRoZSBwYXR0ZXJuIHRvIHRyYW5zZm9ybS5cbiAqIEByZXR1cm4ge1JlZ0V4cH0gICAgICAgICAgIFRoZSBwYXR0ZXJuJ3MgZXF1aXZhbGVudCBhcyBhIFJlZ0V4cC5cbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gICAgICAgIElmIHRoZSBwYXR0ZXJuIGlzIG5vdCBhIHZhbGlkIE1hdGNoUGF0dGVyblxuICovXG5mdW5jdGlvbiBtYXRjaFBhdHRlcm5Ub1JlZ2V4cChwYXR0ZXJuKSB7XG4gICAgaWYgKHBhdHRlcm4gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAvXig/Omh0dHB8aHR0cHN8d3N8d3NzfGZpbGV8ZnRwfGZ0cHMpOlxcL1xcLy87XG4gICAgfVxuICBcbiAgICBjb25zdCBzY2hlbWVTZWdtZW50ID0gJyhcXFxcKnxodHRwfGh0dHBzfHdzfHdzc3xmaWxlfGZ0cHxmdHBzKSc7XG4gICAgY29uc3QgaG9zdFNlZ21lbnQgPSAnKFxcXFwqfCg/OlxcXFwqXFxcXC4pPyg/OlteLypdKykpPyc7XG4gICAgY29uc3QgcGF0aFNlZ21lbnQgPSAnKC4qKSc7XG4gICAgY29uc3QgbWF0Y2hQYXR0ZXJuUmVnRXhwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgYF4ke3NjaGVtZVNlZ21lbnR9Oi8vJHtob3N0U2VnbWVudH0vJHtwYXRoU2VnbWVudH0kYFxuICAgICk7XG4gIFxuICAgIGNvbnN0IG1hdGNoID0gbWF0Y2hQYXR0ZXJuUmVnRXhwLmV4ZWMocGF0dGVybik7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBcIiR7cGF0dGVybn1cIiBpcyBub3QgYSB2YWxpZCBNYXRjaFBhdHRlcm5gKTtcbiAgICB9XG4gIFxuICAgIGxldCBbLCBzY2hlbWUsIGhvc3QsIHBhdGhdID0gbWF0Y2g7XG4gICAgaWYgKCFob3N0ICYmIHNjaGVtZSAhPT0gJ2ZpbGUnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFwiJHtwYXR0ZXJufVwiIGRvZXMgbm90IGhhdmUgYSB2YWxpZCBob3N0YCk7XG4gICAgfVxuICBcbiAgICBjb25zdCBzY2hlbWVSZWdleCA9IHNjaGVtZSA9PT0gJyonID8gJyhodHRwfGh0dHBzfHdzfHdzcyknIDogc2NoZW1lO1xuICBcbiAgICBsZXQgaG9zdFJlZ2V4ID0gJyc7XG4gICAgaWYgKGhvc3QpIHtcbiAgICAgICAgaWYgKGhvc3QgPT09ICcqJykge1xuICAgICAgICAgICAgaG9zdFJlZ2V4ID0gJ1teL10rPyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaG9zdC5zdGFydHNXaXRoKCcqLicpKSB7XG4gICAgICAgICAgICAgICAgaG9zdFJlZ2V4ID0gJyg/OlteL10rP1xcXFwuKT8nO1xuICAgICAgICAgICAgICAgIGhvc3QgPSBob3N0LnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhvc3RSZWdleCArPSBob3N0LnJlcGxhY2UoL1xcLi9nLCAnXFxcXC4nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgXG4gICAgbGV0IHBhdGhSZWdleCA9ICcvPyc7XG4gICAgaWYgKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGggPT09ICcqJykge1xuICAgICAgICAgICAgcGF0aFJlZ2V4ID0gJygvLiopPyc7XG4gICAgICAgIH0gZWxzZSBpZiAocGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgICAgICAgcGF0aFJlZ2V4ID0gYC8ke3BhdGgucmVwbGFjZSgvXFwuL2csICdcXFxcLicpLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyl9YDtcbiAgICAgICAgfVxuICAgIH1cbiAgXG4gICAgY29uc3QgcmVnZXggPSBgXiR7c2NoZW1lUmVnZXh9Oi8vJHtob3N0UmVnZXh9JHtwYXRoUmVnZXh9JGA7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYXRjaFBhdHRlcm5Ub1JlZ2V4cCIsIlxuXG5leHBvcnQgY29uc3QgbG9jYWxBc3luY0dldCA9IChrZXkpPT57XG4gICAgLy8gY29uc29sZS5sb2coJ2dldEtleScsa2V5KVxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtrZXldLChyZXN1bHQpPT57XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdFtrZXldKVxuICAgICAgICB9KVxuICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgLy8gY29uc29sZS5sb2coZSlcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxufVxuXG5leHBvcnQgY29uc3QgbG9jYWxBc3luY1NldCA9IChvYmplY3QpPT57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUscmVqZWN0KT0+e1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQob2JqZWN0LCgpPT57XG4gICAgICAgICAgICByZXNvbHZlKG9iamVjdClcbiAgICAgICAgfSlcbiAgICB9KS5jYXRjaChlPT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSlcbn1cblxuXG5cbmV4cG9ydCBjb25zdCBsb2NhbFN5bmNHZXQgPSAoa2V5KT0+e1xuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRTeW5jIEtleScsa2V5KVxuICAgIGxldCByZXN1bHQ6IGFueSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBjb25zdCBsb2NhbFN5bmNTZXQgPSAob2JqZWN0KT0+e1xuICAgIC8vIGNvbnNvbGUubG9nKCdzZXRTeW5jIE9iamVjdCcsT2JqZWN0LmtleXMob2JqZWN0KVswXSwgb2JqZWN0W09iamVjdC5rZXlzKG9iamVjdClbMF1dKVxuICAgIGxldCBzdG9yZWQgPSBvYmplY3RbT2JqZWN0LmtleXMob2JqZWN0KVswXV1cbiAgICBpZih0eXBlb2Ygc3RvcmVkICE9ICdzdHJpbmcnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2NhbFN5bmNTZXQgbXVzdCBzZXQgYSBzdHJpbmcga2V5IGFuZCB2YWx1ZS4gIFVzZSBKU09OLnN0cmluZ2lmeSBpZiBvYmplY3Qgc3RvcmFnZSBpcyBuZWVkZWQuJylcbiAgICB9XG4gICAgbGV0IHJlc3VsdDogYW55ID0gbG9jYWxTdG9yYWdlLnNldEl0ZW0oT2JqZWN0LmtleXMob2JqZWN0KVswXSwgb2JqZWN0W09iamVjdC5rZXlzKG9iamVjdClbMF1dKVxuICAgIHJldHVybiByZXN1bHRcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=