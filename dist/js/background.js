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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/js-logger/src/logger.js":
/*!**********************************************!*\
  !*** ./node_modules/js-logger/src/logger.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * js-logger - http://github.com/jonnyreeves/js-logger
 * Jonny Reeves, http://jonnyreeves.co.uk/
 * js-logger may be freely distributed under the MIT license.
 */
(function (global) {
	"use strict";

	// Top level module for the global, static logger instance.
	var Logger = { };

	// For those that are at home that are keeping score.
	Logger.VERSION = "1.6.1";

	// Function which handles all incoming log messages.
	var logHandler;

	// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
	var contextualLoggersByNameMap = {};

	// Polyfill for ES5's Function.bind.
	var bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
	var merge = function () {
		var args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	// Helper to define a logging level object; helps with optimisation.
	var defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	// Predefined logging levels.
	Logger.TRACE = defineLogLevel(1, 'TRACE');
	Logger.DEBUG = defineLogLevel(2, 'DEBUG');
	Logger.INFO = defineLogLevel(3, 'INFO');
	Logger.TIME = defineLogLevel(4, 'TIME');
	Logger.WARN = defineLogLevel(5, 'WARN');
	Logger.ERROR = defineLogLevel(8, 'ERROR');
	Logger.OFF = defineLogLevel(99, 'OFF');

	// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
	// of each other.
	var ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  // Convenience alias.
	};

	ContextualLogger.prototype = {
		// Changes the current logging level for the logging instance.
		setLevel: function (newLevel) {
			// Ensure the supplied Level object looks valid.
			if (newLevel && "value" in newLevel) {
				this.context.filterLevel = newLevel;
			}
		},
		
		// Gets the current logging level for the logging instance
		getLevel: function () {
			return this.context.filterLevel;
		},

		// Is the logger configured to output messages at the supplied level?
		enabledFor: function (lvl) {
			var filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		trace: function () {
			this.invoke(Logger.TRACE, arguments);
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		time: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'start' ]);
			}
		},

		timeEnd: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'end' ]);
			}
		},

		// Invokes the logger callback if it's not being filtered.
		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	// Protected instance which all calls to the to level `Logger` module will be routed through.
	var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	// Configure the global Logger instance.
	(function() {
		// Shortcut for optimisers.
		var L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.trace = bind(globalLogger, globalLogger.trace);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.time = bind(globalLogger, globalLogger.time);
		L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		// Don't forget the convenience alias!
		L.log = L.info;
	}());

	// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
	// object with the supplied log messages and the second being a context object which contains a hash of stateful
	// parameters which the logging function can consume.
	Logger.setHandler = function (func) {
		logHandler = func;
	};

	// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
	// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
	Logger.setLevel = function(level) {
		// Set the globalLogger's level.
		globalLogger.setLevel(level);

		// Apply this level to all registered contextual loggers.
		for (var key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	// Gets the global logging filter level
	Logger.getLevel = function() {
		return globalLogger.getLevel();
	};

	// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
	// default context and log handler.
	Logger.get = function (name) {
		// All logger instances are cached so they can be configured ahead of use.
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
	// write to the window's console object (if present); the optional options object can be used to customise the
	// formatter used to format each log message.
	Logger.createDefaultHandler = function (options) {
		options = options || {};

		options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
			// Prepend the logger's name to the log message for easy identification.
			if (context.name) {
				messages.unshift("[" + context.name + "]");
			}
		};

		// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
		// that don't offer a native console method.
		var timerStartTimeByLabelMap = {};

		// Support for IE8+ (and other, slightly more sane environments)
		var invokeConsoleMethod = function (hdlr, messages) {
			Function.prototype.apply.call(hdlr, console, messages);
		};

		// Check for the presence of a logger.
		if (typeof console === "undefined") {
			return function () { /* no console */ };
		}

		return function(messages, context) {
			// Convert arguments object to Array.
			messages = Array.prototype.slice.call(messages);

			var hdlr = console.log;
			var timerLabel;

			if (context.level === Logger.TIME) {
				timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

				if (messages[1] === 'start') {
					if (console.time) {
						console.time(timerLabel);
					}
					else {
						timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
					}
				}
				else {
					if (console.timeEnd) {
						console.timeEnd(timerLabel);
					}
					else {
						invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
					}
				}
			}
			else {
				// Delegate through to custom warn/error loggers if present on the console.
				if (context.level === Logger.WARN && console.warn) {
					hdlr = console.warn;
				} else if (context.level === Logger.ERROR && console.error) {
					hdlr = console.error;
				} else if (context.level === Logger.INFO && console.info) {
					hdlr = console.info;
				} else if (context.level === Logger.DEBUG && console.debug) {
					hdlr = console.debug;
				} else if (context.level === Logger.TRACE && console.trace) {
					hdlr = console.trace;
				}

				options.formatter(messages, context);
				invokeConsoleMethod(hdlr, messages);
			}
		};
	};

	// Configure and example a Default implementation which writes to the `window.console` (if present).  The
	// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
	Logger.useDefaults = function(options) {
		Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
		Logger.setHandler(Logger.createDefaultHandler(options));
	};

	// Createa an alias to useDefaults to avoid reaking a react-hooks rule.
	Logger.setDefaults = Logger.useDefaults;

	// Export to popular environments boilerplate.
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (Logger),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else {}
}(this));


/***/ }),

/***/ "./src/app/background.ts":
/*!*******************************!*\
  !*** ./src/app/background.ts ***!
  \*******************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storageChrome_1 = __webpack_require__(/*! ./storageChrome */ "./src/app/storageChrome.ts");
const webRequest_1 = __webpack_require__(/*! ./webRequest */ "./src/app/webRequest.ts");
const js_logger_1 = __importDefault(__webpack_require__(/*! js-logger */ "./node_modules/js-logger/src/logger.js"));
var opt_extraInfoSpec = [
    "blocking",
    "requestBody"
];
function getList(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://raw.githubusercontent.com/badblocker/bb-chrome-extension/main/dist/js/${name}List.json`;
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
            .catch(error => js_logger_1.default.error(error));
        //   console.log(newList)
        return newList;
    });
}
// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
    js_logger_1.default.info('onStartup....');
    startRequest();
});
// alarm listener
chrome.alarms.onAlarm.addListener(alarm => {
    // if watchdog is triggered, check whether refresh alarm is there
    if (alarm && alarm.name === 'watchdog') {
        chrome.alarms.get('refresh', alarm => {
            if (alarm) {
                js_logger_1.default.info('Refresh alarm exists. Yay.');
            }
            else {
                // if it is not there, start a new request and reschedule refresh alarm
                js_logger_1.default.info("Refresh alarm doesn't exist, starting a new one");
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
    js_logger_1.default.info('schedule refresh alarm to 30 minutes...');
    chrome.alarms.create('refresh', { periodInMinutes: 2 });
}
// schedule a watchdog check every 5 minutes
function scheduleWatchdog() {
    js_logger_1.default.info('schedule watchdog alarm to 5 minutes...');
    chrome.alarms.create('watchdog', { periodInMinutes: 1 });
}
// fetch data and save to local storage
function startRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        js_logger_1.default.info('start HTTP Request...');
        yield getList('record').then(list => {
            storageChrome_1.localAsyncSet({
                '__recordList': JSON.stringify(list)
            });
            js_logger_1.default.info('recordList Refreshed');
        });
        yield getList('search').then(list => {
            storageChrome_1.localAsyncSet({
                '__searchList': JSON.stringify(list)
            });
            js_logger_1.default.info('searchList Refreshed');
        });
        chrome.webRequest.onBeforeRequest.removeListener(webRequest_1.callback);
        chrome.webRequest.onBeforeRequest.addListener(webRequest_1.callback, webRequest_1.filter(), opt_extraInfoSpec);
    });
}
// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
    js_logger_1.default.info('onInstalled....');
    storageChrome_1.localSyncSet({ '__searchList': '{}' });
    storageChrome_1.localSyncSet({ '__recordList': '{}' });
    scheduleRequest();
    scheduleWatchdog();
    startRequest();
});


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

/***/ "./src/app/searchList.json":
/*!*********************************!*\
  !*** ./src/app/searchList.json ***!
  \*********************************/
/*! exports provided: *.redzeppelinpizza.com/*, *.example.com/*, *.cnn3.com/*, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"*.redzeppelinpizza.com/*\":\"redzeppelinpizza.com\",\"*.example.com/*\":\"example.com\",\"*.cnn3.com/*\":\"cnn3.com\"}");

/***/ }),

/***/ "./src/app/storageChrome.ts":
/*!**********************************!*\
  !*** ./src/app/storageChrome.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.localSyncSet = exports.localSyncGet = exports.localAsyncSet = exports.localAsyncGet = exports.chromeStoreSet = exports.chromeStoreAsyncGet = void 0;
exports.chromeStoreAsyncGet = (key) => {
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
exports.chromeStoreSet = (object) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(object, () => {
            resolve(object);
        });
    }).catch(e => {
        // console.log(e)
        return null;
    });
};
exports.localAsyncGet = (key) => {
    return new Promise((resolve, reject) => {
        let result = localStorage.getItem(key);
        resolve(result);
    }).catch(e => {
        // console.log(e)
        return null;
    });
};
exports.localAsyncSet = (object) => {
    return new Promise((resolve, reject) => {
        let stored = object[Object.keys(object)[0]];
        if (typeof stored != 'string') {
            throw new Error('localSyncSet must set a string key and value.  Use JSON.stringify if object storage is needed.');
        }
        let result = localStorage.setItem(Object.keys(object)[0], object[Object.keys(object)[0]]);
        resolve(result);
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


/***/ }),

/***/ "./src/app/webRequest.ts":
/*!*******************************!*\
  !*** ./src/app/webRequest.ts ***!
  \*******************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.callback = void 0;
const matcher_1 = __importDefault(__webpack_require__(/*! ./matcher */ "./src/app/matcher.ts"));
const storageChrome_1 = __webpack_require__(/*! ./storageChrome */ "./src/app/storageChrome.ts");
let recordList = __webpack_require__(/*! ./recordList.json */ "./src/app/recordList.json");
let searchList = __webpack_require__(/*! ./searchList.json */ "./src/app/searchList.json");
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
    return __awaiter(this, void 0, void 0, function* () {
        // Make sure lists are up-to-date
        // Only refresh this list every hour to keep the callback lightweight  
        if (Date.now() > cacheStamp + 1000 * 60 * 60) {
            recordList = JSON.parse(yield storageChrome_1.localAsyncGet('__recordList')) || recordList;
            searchList = JSON.parse(yield storageChrome_1.localAsyncGet('__searchList')) || searchList;
            preferenceList = JSON.parse(yield storageChrome_1.localAsyncGet('__preferenceList')) || preferenceList;
        }
    });
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2pzLWxvZ2dlci9zcmMvbG9nZ2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21hdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9zdG9yYWdlQ2hyb21lLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvd2ViUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw4Q0FBOEM7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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QUFNLENBQUMsSUFBSSxJQUFJO0lBQzdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0FBQ2hDLENBQUM7QUFFRCxTQUFlLFlBQVk7O1FBQ3ZCLGlDQUFpQztRQUNqQyx1RUFBdUU7UUFDdkUsSUFBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxHQUFFLElBQUksR0FBQyxFQUFFLEdBQUMsRUFBRSxFQUFDO1lBQ3JDLFVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sNkJBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLFVBQVU7WUFDL0UsVUFBVSxHQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSw2QkFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksVUFBVTtZQUMvRSxjQUFjLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLDZCQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLGNBQWM7U0FDeEY7SUFDTCxDQUFDO0NBQUEiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FwcC9iYWNrZ3JvdW5kLnRzXCIpO1xuIiwiLyohXHJcbiAqIGpzLWxvZ2dlciAtIGh0dHA6Ly9naXRodWIuY29tL2pvbm55cmVldmVzL2pzLWxvZ2dlclxyXG4gKiBKb25ueSBSZWV2ZXMsIGh0dHA6Ly9qb25ueXJlZXZlcy5jby51ay9cclxuICoganMtbG9nZ2VyIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxyXG4gKi9cclxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gVG9wIGxldmVsIG1vZHVsZSBmb3IgdGhlIGdsb2JhbCwgc3RhdGljIGxvZ2dlciBpbnN0YW5jZS5cclxuXHR2YXIgTG9nZ2VyID0geyB9O1xyXG5cclxuXHQvLyBGb3IgdGhvc2UgdGhhdCBhcmUgYXQgaG9tZSB0aGF0IGFyZSBrZWVwaW5nIHNjb3JlLlxyXG5cdExvZ2dlci5WRVJTSU9OID0gXCIxLjYuMVwiO1xyXG5cclxuXHQvLyBGdW5jdGlvbiB3aGljaCBoYW5kbGVzIGFsbCBpbmNvbWluZyBsb2cgbWVzc2FnZXMuXHJcblx0dmFyIGxvZ0hhbmRsZXI7XHJcblxyXG5cdC8vIE1hcCBvZiBDb250ZXh0dWFsTG9nZ2VyIGluc3RhbmNlcyBieSBuYW1lOyB1c2VkIGJ5IExvZ2dlci5nZXQoKSB0byByZXR1cm4gdGhlIHNhbWUgbmFtZWQgaW5zdGFuY2UuXHJcblx0dmFyIGNvbnRleHR1YWxMb2dnZXJzQnlOYW1lTWFwID0ge307XHJcblxyXG5cdC8vIFBvbHlmaWxsIGZvciBFUzUncyBGdW5jdGlvbi5iaW5kLlxyXG5cdHZhciBiaW5kID0gZnVuY3Rpb24oc2NvcGUsIGZ1bmMpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmMuYXBwbHkoc2NvcGUsIGFyZ3VtZW50cyk7XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdC8vIFN1cGVyIGV4Y2l0aW5nIG9iamVjdCBtZXJnZXItbWF0cm9uIDkwMDAgYWRkaW5nIGFub3RoZXIgMTAwIGJ5dGVzIHRvIHlvdXIgZG93bmxvYWQuXHJcblx0dmFyIG1lcmdlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMsIHRhcmdldCA9IGFyZ3NbMF0sIGtleSwgaTtcclxuXHRcdGZvciAoaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGZvciAoa2V5IGluIGFyZ3NbaV0pIHtcclxuXHRcdFx0XHRpZiAoIShrZXkgaW4gdGFyZ2V0KSAmJiBhcmdzW2ldLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0XHRcdHRhcmdldFtrZXldID0gYXJnc1tpXVtrZXldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRhcmdldDtcclxuXHR9O1xyXG5cclxuXHQvLyBIZWxwZXIgdG8gZGVmaW5lIGEgbG9nZ2luZyBsZXZlbCBvYmplY3Q7IGhlbHBzIHdpdGggb3B0aW1pc2F0aW9uLlxyXG5cdHZhciBkZWZpbmVMb2dMZXZlbCA9IGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XHJcblx0XHRyZXR1cm4geyB2YWx1ZTogdmFsdWUsIG5hbWU6IG5hbWUgfTtcclxuXHR9O1xyXG5cclxuXHQvLyBQcmVkZWZpbmVkIGxvZ2dpbmcgbGV2ZWxzLlxyXG5cdExvZ2dlci5UUkFDRSA9IGRlZmluZUxvZ0xldmVsKDEsICdUUkFDRScpO1xyXG5cdExvZ2dlci5ERUJVRyA9IGRlZmluZUxvZ0xldmVsKDIsICdERUJVRycpO1xyXG5cdExvZ2dlci5JTkZPID0gZGVmaW5lTG9nTGV2ZWwoMywgJ0lORk8nKTtcclxuXHRMb2dnZXIuVElNRSA9IGRlZmluZUxvZ0xldmVsKDQsICdUSU1FJyk7XHJcblx0TG9nZ2VyLldBUk4gPSBkZWZpbmVMb2dMZXZlbCg1LCAnV0FSTicpO1xyXG5cdExvZ2dlci5FUlJPUiA9IGRlZmluZUxvZ0xldmVsKDgsICdFUlJPUicpO1xyXG5cdExvZ2dlci5PRkYgPSBkZWZpbmVMb2dMZXZlbCg5OSwgJ09GRicpO1xyXG5cclxuXHQvLyBJbm5lciBjbGFzcyB3aGljaCBwZXJmb3JtcyB0aGUgYnVsayBvZiB0aGUgd29yazsgQ29udGV4dHVhbExvZ2dlciBpbnN0YW5jZXMgY2FuIGJlIGNvbmZpZ3VyZWQgaW5kZXBlbmRlbnRseVxyXG5cdC8vIG9mIGVhY2ggb3RoZXIuXHJcblx0dmFyIENvbnRleHR1YWxMb2dnZXIgPSBmdW5jdGlvbihkZWZhdWx0Q29udGV4dCkge1xyXG5cdFx0dGhpcy5jb250ZXh0ID0gZGVmYXVsdENvbnRleHQ7XHJcblx0XHR0aGlzLnNldExldmVsKGRlZmF1bHRDb250ZXh0LmZpbHRlckxldmVsKTtcclxuXHRcdHRoaXMubG9nID0gdGhpcy5pbmZvOyAgLy8gQ29udmVuaWVuY2UgYWxpYXMuXHJcblx0fTtcclxuXHJcblx0Q29udGV4dHVhbExvZ2dlci5wcm90b3R5cGUgPSB7XHJcblx0XHQvLyBDaGFuZ2VzIHRoZSBjdXJyZW50IGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBsb2dnaW5nIGluc3RhbmNlLlxyXG5cdFx0c2V0TGV2ZWw6IGZ1bmN0aW9uIChuZXdMZXZlbCkge1xyXG5cdFx0XHQvLyBFbnN1cmUgdGhlIHN1cHBsaWVkIExldmVsIG9iamVjdCBsb29rcyB2YWxpZC5cclxuXHRcdFx0aWYgKG5ld0xldmVsICYmIFwidmFsdWVcIiBpbiBuZXdMZXZlbCkge1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5maWx0ZXJMZXZlbCA9IG5ld0xldmVsO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHQvLyBHZXRzIHRoZSBjdXJyZW50IGxvZ2dpbmcgbGV2ZWwgZm9yIHRoZSBsb2dnaW5nIGluc3RhbmNlXHJcblx0XHRnZXRMZXZlbDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb250ZXh0LmZpbHRlckxldmVsO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBJcyB0aGUgbG9nZ2VyIGNvbmZpZ3VyZWQgdG8gb3V0cHV0IG1lc3NhZ2VzIGF0IHRoZSBzdXBwbGllZCBsZXZlbD9cclxuXHRcdGVuYWJsZWRGb3I6IGZ1bmN0aW9uIChsdmwpIHtcclxuXHRcdFx0dmFyIGZpbHRlckxldmVsID0gdGhpcy5jb250ZXh0LmZpbHRlckxldmVsO1xyXG5cdFx0XHRyZXR1cm4gbHZsLnZhbHVlID49IGZpbHRlckxldmVsLnZhbHVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0cmFjZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGlzLmludm9rZShMb2dnZXIuVFJBQ0UsIGFyZ3VtZW50cyk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlYnVnOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMuaW52b2tlKExvZ2dlci5ERUJVRywgYXJndW1lbnRzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5mbzogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGlzLmludm9rZShMb2dnZXIuSU5GTywgYXJndW1lbnRzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0d2FybjogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGlzLmludm9rZShMb2dnZXIuV0FSTiwgYXJndW1lbnRzKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dGhpcy5pbnZva2UoTG9nZ2VyLkVSUk9SLCBhcmd1bWVudHMpO1xyXG5cdFx0fSxcclxuXHJcblx0XHR0aW1lOiBmdW5jdGlvbiAobGFiZWwpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBsYWJlbCA9PT0gJ3N0cmluZycgJiYgbGFiZWwubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52b2tlKExvZ2dlci5USU1FLCBbIGxhYmVsLCAnc3RhcnQnIF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHRpbWVFbmQ6IGZ1bmN0aW9uIChsYWJlbCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJyAmJiBsYWJlbC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0dGhpcy5pbnZva2UoTG9nZ2VyLlRJTUUsIFsgbGFiZWwsICdlbmQnIF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIEludm9rZXMgdGhlIGxvZ2dlciBjYWxsYmFjayBpZiBpdCdzIG5vdCBiZWluZyBmaWx0ZXJlZC5cclxuXHRcdGludm9rZTogZnVuY3Rpb24gKGxldmVsLCBtc2dBcmdzKSB7XHJcblx0XHRcdGlmIChsb2dIYW5kbGVyICYmIHRoaXMuZW5hYmxlZEZvcihsZXZlbCkpIHtcclxuXHRcdFx0XHRsb2dIYW5kbGVyKG1zZ0FyZ3MsIG1lcmdlKHsgbGV2ZWw6IGxldmVsIH0sIHRoaXMuY29udGV4dCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gUHJvdGVjdGVkIGluc3RhbmNlIHdoaWNoIGFsbCBjYWxscyB0byB0aGUgdG8gbGV2ZWwgYExvZ2dlcmAgbW9kdWxlIHdpbGwgYmUgcm91dGVkIHRocm91Z2guXHJcblx0dmFyIGdsb2JhbExvZ2dlciA9IG5ldyBDb250ZXh0dWFsTG9nZ2VyKHsgZmlsdGVyTGV2ZWw6IExvZ2dlci5PRkYgfSk7XHJcblxyXG5cdC8vIENvbmZpZ3VyZSB0aGUgZ2xvYmFsIExvZ2dlciBpbnN0YW5jZS5cclxuXHQoZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBTaG9ydGN1dCBmb3Igb3B0aW1pc2Vycy5cclxuXHRcdHZhciBMID0gTG9nZ2VyO1xyXG5cclxuXHRcdEwuZW5hYmxlZEZvciA9IGJpbmQoZ2xvYmFsTG9nZ2VyLCBnbG9iYWxMb2dnZXIuZW5hYmxlZEZvcik7XHJcblx0XHRMLnRyYWNlID0gYmluZChnbG9iYWxMb2dnZXIsIGdsb2JhbExvZ2dlci50cmFjZSk7XHJcblx0XHRMLmRlYnVnID0gYmluZChnbG9iYWxMb2dnZXIsIGdsb2JhbExvZ2dlci5kZWJ1Zyk7XHJcblx0XHRMLnRpbWUgPSBiaW5kKGdsb2JhbExvZ2dlciwgZ2xvYmFsTG9nZ2VyLnRpbWUpO1xyXG5cdFx0TC50aW1lRW5kID0gYmluZChnbG9iYWxMb2dnZXIsIGdsb2JhbExvZ2dlci50aW1lRW5kKTtcclxuXHRcdEwuaW5mbyA9IGJpbmQoZ2xvYmFsTG9nZ2VyLCBnbG9iYWxMb2dnZXIuaW5mbyk7XHJcblx0XHRMLndhcm4gPSBiaW5kKGdsb2JhbExvZ2dlciwgZ2xvYmFsTG9nZ2VyLndhcm4pO1xyXG5cdFx0TC5lcnJvciA9IGJpbmQoZ2xvYmFsTG9nZ2VyLCBnbG9iYWxMb2dnZXIuZXJyb3IpO1xyXG5cclxuXHRcdC8vIERvbid0IGZvcmdldCB0aGUgY29udmVuaWVuY2UgYWxpYXMhXHJcblx0XHRMLmxvZyA9IEwuaW5mbztcclxuXHR9KCkpO1xyXG5cclxuXHQvLyBTZXQgdGhlIGdsb2JhbCBsb2dnaW5nIGhhbmRsZXIuICBUaGUgc3VwcGxpZWQgZnVuY3Rpb24gc2hvdWxkIGV4cGVjdCB0d28gYXJndW1lbnRzLCB0aGUgZmlyc3QgYmVpbmcgYW4gYXJndW1lbnRzXHJcblx0Ly8gb2JqZWN0IHdpdGggdGhlIHN1cHBsaWVkIGxvZyBtZXNzYWdlcyBhbmQgdGhlIHNlY29uZCBiZWluZyBhIGNvbnRleHQgb2JqZWN0IHdoaWNoIGNvbnRhaW5zIGEgaGFzaCBvZiBzdGF0ZWZ1bFxyXG5cdC8vIHBhcmFtZXRlcnMgd2hpY2ggdGhlIGxvZ2dpbmcgZnVuY3Rpb24gY2FuIGNvbnN1bWUuXHJcblx0TG9nZ2VyLnNldEhhbmRsZXIgPSBmdW5jdGlvbiAoZnVuYykge1xyXG5cdFx0bG9nSGFuZGxlciA9IGZ1bmM7XHJcblx0fTtcclxuXHJcblx0Ly8gU2V0cyB0aGUgZ2xvYmFsIGxvZ2dpbmcgZmlsdGVyIGxldmVsIHdoaWNoIGFwcGxpZXMgdG8gKmFsbCogcHJldmlvdXNseSByZWdpc3RlcmVkLCBhbmQgZnV0dXJlIExvZ2dlciBpbnN0YW5jZXMuXHJcblx0Ly8gKG5vdGUgdGhhdCBuYW1lZCBsb2dnZXJzIChyZXRyaWV2ZWQgdmlhIGBMb2dnZXIuZ2V0YCkgY2FuIGJlIGNvbmZpZ3VyZWQgaW5kZXBlbmRlbnRseSBpZiByZXF1aXJlZCkuXHJcblx0TG9nZ2VyLnNldExldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcclxuXHRcdC8vIFNldCB0aGUgZ2xvYmFsTG9nZ2VyJ3MgbGV2ZWwuXHJcblx0XHRnbG9iYWxMb2dnZXIuc2V0TGV2ZWwobGV2ZWwpO1xyXG5cclxuXHRcdC8vIEFwcGx5IHRoaXMgbGV2ZWwgdG8gYWxsIHJlZ2lzdGVyZWQgY29udGV4dHVhbCBsb2dnZXJzLlxyXG5cdFx0Zm9yICh2YXIga2V5IGluIGNvbnRleHR1YWxMb2dnZXJzQnlOYW1lTWFwKSB7XHJcblx0XHRcdGlmIChjb250ZXh0dWFsTG9nZ2Vyc0J5TmFtZU1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdFx0Y29udGV4dHVhbExvZ2dlcnNCeU5hbWVNYXBba2V5XS5zZXRMZXZlbChsZXZlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBHZXRzIHRoZSBnbG9iYWwgbG9nZ2luZyBmaWx0ZXIgbGV2ZWxcclxuXHRMb2dnZXIuZ2V0TGV2ZWwgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBnbG9iYWxMb2dnZXIuZ2V0TGV2ZWwoKTtcclxuXHR9O1xyXG5cclxuXHQvLyBSZXRyaWV2ZSBhIENvbnRleHR1YWxMb2dnZXIgaW5zdGFuY2UuICBOb3RlIHRoYXQgbmFtZWQgbG9nZ2VycyBhdXRvbWF0aWNhbGx5IGluaGVyaXQgdGhlIGdsb2JhbCBsb2dnZXIncyBsZXZlbCxcclxuXHQvLyBkZWZhdWx0IGNvbnRleHQgYW5kIGxvZyBoYW5kbGVyLlxyXG5cdExvZ2dlci5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xyXG5cdFx0Ly8gQWxsIGxvZ2dlciBpbnN0YW5jZXMgYXJlIGNhY2hlZCBzbyB0aGV5IGNhbiBiZSBjb25maWd1cmVkIGFoZWFkIG9mIHVzZS5cclxuXHRcdHJldHVybiBjb250ZXh0dWFsTG9nZ2Vyc0J5TmFtZU1hcFtuYW1lXSB8fFxyXG5cdFx0XHQoY29udGV4dHVhbExvZ2dlcnNCeU5hbWVNYXBbbmFtZV0gPSBuZXcgQ29udGV4dHVhbExvZ2dlcihtZXJnZSh7IG5hbWU6IG5hbWUgfSwgZ2xvYmFsTG9nZ2VyLmNvbnRleHQpKSk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ3JlYXRlRGVmYXVsdEhhbmRsZXIgcmV0dXJucyBhIGhhbmRsZXIgZnVuY3Rpb24gd2hpY2ggY2FuIGJlIHBhc3NlZCB0byBgTG9nZ2VyLnNldEhhbmRsZXIoKWAgd2hpY2ggd2lsbFxyXG5cdC8vIHdyaXRlIHRvIHRoZSB3aW5kb3cncyBjb25zb2xlIG9iamVjdCAoaWYgcHJlc2VudCk7IHRoZSBvcHRpb25hbCBvcHRpb25zIG9iamVjdCBjYW4gYmUgdXNlZCB0byBjdXN0b21pc2UgdGhlXHJcblx0Ly8gZm9ybWF0dGVyIHVzZWQgdG8gZm9ybWF0IGVhY2ggbG9nIG1lc3NhZ2UuXHJcblx0TG9nZ2VyLmNyZWF0ZURlZmF1bHRIYW5kbGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuXHRcdG9wdGlvbnMuZm9ybWF0dGVyID0gb3B0aW9ucy5mb3JtYXR0ZXIgfHwgZnVuY3Rpb24gZGVmYXVsdE1lc3NhZ2VGb3JtYXR0ZXIobWVzc2FnZXMsIGNvbnRleHQpIHtcclxuXHRcdFx0Ly8gUHJlcGVuZCB0aGUgbG9nZ2VyJ3MgbmFtZSB0byB0aGUgbG9nIG1lc3NhZ2UgZm9yIGVhc3kgaWRlbnRpZmljYXRpb24uXHJcblx0XHRcdGlmIChjb250ZXh0Lm5hbWUpIHtcclxuXHRcdFx0XHRtZXNzYWdlcy51bnNoaWZ0KFwiW1wiICsgY29udGV4dC5uYW1lICsgXCJdXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIE1hcCBvZiB0aW1lc3RhbXBzIGJ5IHRpbWVyIGxhYmVscyB1c2VkIHRvIHRyYWNrIGAjdGltZWAgYW5kIGAjdGltZUVuZCgpYCBpbnZvY2F0aW9ucyBpbiBlbnZpcm9ubWVudHNcclxuXHRcdC8vIHRoYXQgZG9uJ3Qgb2ZmZXIgYSBuYXRpdmUgY29uc29sZSBtZXRob2QuXHJcblx0XHR2YXIgdGltZXJTdGFydFRpbWVCeUxhYmVsTWFwID0ge307XHJcblxyXG5cdFx0Ly8gU3VwcG9ydCBmb3IgSUU4KyAoYW5kIG90aGVyLCBzbGlnaHRseSBtb3JlIHNhbmUgZW52aXJvbm1lbnRzKVxyXG5cdFx0dmFyIGludm9rZUNvbnNvbGVNZXRob2QgPSBmdW5jdGlvbiAoaGRsciwgbWVzc2FnZXMpIHtcclxuXHRcdFx0RnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoaGRsciwgY29uc29sZSwgbWVzc2FnZXMpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBDaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbG9nZ2VyLlxyXG5cdFx0aWYgKHR5cGVvZiBjb25zb2xlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7IC8qIG5vIGNvbnNvbGUgKi8gfTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZnVuY3Rpb24obWVzc2FnZXMsIGNvbnRleHQpIHtcclxuXHRcdFx0Ly8gQ29udmVydCBhcmd1bWVudHMgb2JqZWN0IHRvIEFycmF5LlxyXG5cdFx0XHRtZXNzYWdlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1lc3NhZ2VzKTtcclxuXHJcblx0XHRcdHZhciBoZGxyID0gY29uc29sZS5sb2c7XHJcblx0XHRcdHZhciB0aW1lckxhYmVsO1xyXG5cclxuXHRcdFx0aWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5USU1FKSB7XHJcblx0XHRcdFx0dGltZXJMYWJlbCA9IChjb250ZXh0Lm5hbWUgPyAnWycgKyBjb250ZXh0Lm5hbWUgKyAnXSAnIDogJycpICsgbWVzc2FnZXNbMF07XHJcblxyXG5cdFx0XHRcdGlmIChtZXNzYWdlc1sxXSA9PT0gJ3N0YXJ0Jykge1xyXG5cdFx0XHRcdFx0aWYgKGNvbnNvbGUudGltZSkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLnRpbWUodGltZXJMYWJlbCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGltZXJTdGFydFRpbWVCeUxhYmVsTWFwW3RpbWVyTGFiZWxdID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGNvbnNvbGUudGltZUVuZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLnRpbWVFbmQodGltZXJMYWJlbCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0aW52b2tlQ29uc29sZU1ldGhvZChoZGxyLCBbIHRpbWVyTGFiZWwgKyAnOiAnICtcclxuXHRcdFx0XHRcdFx0XHQobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lclN0YXJ0VGltZUJ5TGFiZWxNYXBbdGltZXJMYWJlbF0pICsgJ21zJyBdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Ly8gRGVsZWdhdGUgdGhyb3VnaCB0byBjdXN0b20gd2Fybi9lcnJvciBsb2dnZXJzIGlmIHByZXNlbnQgb24gdGhlIGNvbnNvbGUuXHJcblx0XHRcdFx0aWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5XQVJOICYmIGNvbnNvbGUud2Fybikge1xyXG5cdFx0XHRcdFx0aGRsciA9IGNvbnNvbGUud2FybjtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5FUlJPUiAmJiBjb25zb2xlLmVycm9yKSB7XHJcblx0XHRcdFx0XHRoZGxyID0gY29uc29sZS5lcnJvcjtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5JTkZPICYmIGNvbnNvbGUuaW5mbykge1xyXG5cdFx0XHRcdFx0aGRsciA9IGNvbnNvbGUuaW5mbztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5ERUJVRyAmJiBjb25zb2xlLmRlYnVnKSB7XHJcblx0XHRcdFx0XHRoZGxyID0gY29uc29sZS5kZWJ1ZztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbnRleHQubGV2ZWwgPT09IExvZ2dlci5UUkFDRSAmJiBjb25zb2xlLnRyYWNlKSB7XHJcblx0XHRcdFx0XHRoZGxyID0gY29uc29sZS50cmFjZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMuZm9ybWF0dGVyKG1lc3NhZ2VzLCBjb250ZXh0KTtcclxuXHRcdFx0XHRpbnZva2VDb25zb2xlTWV0aG9kKGhkbHIsIG1lc3NhZ2VzKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHQvLyBDb25maWd1cmUgYW5kIGV4YW1wbGUgYSBEZWZhdWx0IGltcGxlbWVudGF0aW9uIHdoaWNoIHdyaXRlcyB0byB0aGUgYHdpbmRvdy5jb25zb2xlYCAoaWYgcHJlc2VudCkuICBUaGVcclxuXHQvLyBgb3B0aW9uc2AgaGFzaCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmF1bHQgbG9nTGV2ZWwgYW5kIHByb3ZpZGUgYSBjdXN0b20gbWVzc2FnZSBmb3JtYXR0ZXIuXHJcblx0TG9nZ2VyLnVzZURlZmF1bHRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0TG9nZ2VyLnNldExldmVsKG9wdGlvbnMgJiYgb3B0aW9ucy5kZWZhdWx0TGV2ZWwgfHwgTG9nZ2VyLkRFQlVHKTtcclxuXHRcdExvZ2dlci5zZXRIYW5kbGVyKExvZ2dlci5jcmVhdGVEZWZhdWx0SGFuZGxlcihvcHRpb25zKSk7XHJcblx0fTtcclxuXHJcblx0Ly8gQ3JlYXRlYSBhbiBhbGlhcyB0byB1c2VEZWZhdWx0cyB0byBhdm9pZCByZWFraW5nIGEgcmVhY3QtaG9va3MgcnVsZS5cclxuXHRMb2dnZXIuc2V0RGVmYXVsdHMgPSBMb2dnZXIudXNlRGVmYXVsdHM7XHJcblxyXG5cdC8vIEV4cG9ydCB0byBwb3B1bGFyIGVudmlyb25tZW50cyBib2lsZXJwbGF0ZS5cclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcblx0XHRkZWZpbmUoTG9nZ2VyKTtcclxuXHR9XHJcblx0ZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gTG9nZ2VyO1xyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdExvZ2dlci5fcHJldkxvZ2dlciA9IGdsb2JhbC5Mb2dnZXI7XHJcblxyXG5cdFx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGdsb2JhbC5Mb2dnZXIgPSBMb2dnZXIuX3ByZXZMb2dnZXI7XHJcblx0XHRcdHJldHVybiBMb2dnZXI7XHJcblx0XHR9O1xyXG5cclxuXHRcdGdsb2JhbC5Mb2dnZXIgPSBMb2dnZXI7XHJcblx0fVxyXG59KHRoaXMpKTtcclxuIiwiaW1wb3J0IHsgbG9jYWxTeW5jU2V0LCBsb2NhbFN5bmNHZXQsIGxvY2FsQXN5bmNTZXQgfSBmcm9tICcuL3N0b3JhZ2VDaHJvbWUnXG5pbXBvcnQgeyBjYWxsYmFjaywgZmlsdGVyIH0gZnJvbSAnLi93ZWJSZXF1ZXN0J1xuaW1wb3J0IExvZ2dlciBmcm9tICdqcy1sb2dnZXInXG5cblxudmFyIG9wdF9leHRyYUluZm9TcGVjID0gW1xuICAgIFwiYmxvY2tpbmdcIixcbiAgICBcInJlcXVlc3RCb2R5XCJcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExpc3QobmFtZSl7XG4gIGxldCB1cmwgPSBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhZGJsb2NrZXIvYmItY2hyb21lLWV4dGVuc2lvbi9tYWluL2Rpc3QvanMvJHtuYW1lfUxpc3QuanNvbmBcbiAgdmFyIG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gIG15SGVhZGVycy5hcHBlbmQoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICBteUhlYWRlcnMuYXBwZW5kKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC9wbGFpblwiKTtcbiAgXG4gIHZhciByZXF1ZXN0T3B0aW9uczpvYmplY3QgPSB7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBoZWFkZXJzOiBteUhlYWRlcnMsXG4gICAgcmVkaXJlY3Q6ICdmb2xsb3cnXG4gIH07XG4gIFxuICBsZXQgbmV3TGlzdCA9IGF3YWl0IGZldGNoKHVybCwgcmVxdWVzdE9wdGlvbnMpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIC5jYXRjaChlcnJvciA9PiBMb2dnZXIuZXJyb3IoZXJyb3IpKTtcbiAgLy8gICBjb25zb2xlLmxvZyhuZXdMaXN0KVxuICByZXR1cm4gbmV3TGlzdFxufVxuIFxuXG4vLyBmZXRjaCBhbmQgc2F2ZSBkYXRhIHdoZW4gY2hyb21lIHJlc3RhcnRlZCwgYWxhcm0gd2lsbCBjb250aW51ZSBydW5uaW5nIHdoZW4gY2hyb21lIGlzIHJlc3RhcnRlZFxuY2hyb21lLnJ1bnRpbWUub25TdGFydHVwLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgTG9nZ2VyLmluZm8oJ29uU3RhcnR1cC4uLi4nKTtcbiAgc3RhcnRSZXF1ZXN0KCk7XG59KTtcbiAgXG4vLyBhbGFybSBsaXN0ZW5lclxuY2hyb21lLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKGFsYXJtID0+IHtcbiAgLy8gaWYgd2F0Y2hkb2cgaXMgdHJpZ2dlcmVkLCBjaGVjayB3aGV0aGVyIHJlZnJlc2ggYWxhcm0gaXMgdGhlcmVcbiAgaWYgKGFsYXJtICYmIGFsYXJtLm5hbWUgPT09ICd3YXRjaGRvZycpIHtcbiAgICBjaHJvbWUuYWxhcm1zLmdldCgncmVmcmVzaCcsIGFsYXJtID0+IHtcbiAgICAgIGlmIChhbGFybSkge1xuICAgICAgICBMb2dnZXIuaW5mbygnUmVmcmVzaCBhbGFybSBleGlzdHMuIFlheS4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIGl0IGlzIG5vdCB0aGVyZSwgc3RhcnQgYSBuZXcgcmVxdWVzdCBhbmQgcmVzY2hlZHVsZSByZWZyZXNoIGFsYXJtXG4gICAgICAgIExvZ2dlci5pbmZvKFwiUmVmcmVzaCBhbGFybSBkb2Vzbid0IGV4aXN0LCBzdGFydGluZyBhIG5ldyBvbmVcIik7XG4gICAgICAgIHN0YXJ0UmVxdWVzdCgpO1xuICAgICAgICBzY2hlZHVsZVJlcXVlc3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiByZWZyZXNoIGFsYXJtIHRyaWdnZXJlZCwgc3RhcnQgYSBuZXcgcmVxdWVzdFxuICAgIHN0YXJ0UmVxdWVzdCgpO1xuICB9XG59KTtcblxuXG5cblxuLy8gc2NoZWR1bGUgYSBuZXcgZmV0Y2ggZXZlcnkgMzAgbWludXRlc1xuZnVuY3Rpb24gc2NoZWR1bGVSZXF1ZXN0KCkge1xuICBMb2dnZXIuaW5mbygnc2NoZWR1bGUgcmVmcmVzaCBhbGFybSB0byAzMCBtaW51dGVzLi4uJyk7XG4gIGNocm9tZS5hbGFybXMuY3JlYXRlKCdyZWZyZXNoJywgeyBwZXJpb2RJbk1pbnV0ZXM6IDIgfSk7XG59XG4gIFxuXG5cbi8vIHNjaGVkdWxlIGEgd2F0Y2hkb2cgY2hlY2sgZXZlcnkgNSBtaW51dGVzXG5mdW5jdGlvbiBzY2hlZHVsZVdhdGNoZG9nKCkge1xuICBMb2dnZXIuaW5mbygnc2NoZWR1bGUgd2F0Y2hkb2cgYWxhcm0gdG8gNSBtaW51dGVzLi4uJyk7XG4gIGNocm9tZS5hbGFybXMuY3JlYXRlKCd3YXRjaGRvZycsIHsgcGVyaW9kSW5NaW51dGVzOiAxIH0pO1xufVxuICBcblxuXG4vLyBmZXRjaCBkYXRhIGFuZCBzYXZlIHRvIGxvY2FsIHN0b3JhZ2VcbmFzeW5jIGZ1bmN0aW9uIHN0YXJ0UmVxdWVzdCgpIHtcbiAgTG9nZ2VyLmluZm8oJ3N0YXJ0IEhUVFAgUmVxdWVzdC4uLicpO1xuICBhd2FpdCBnZXRMaXN0KCdyZWNvcmQnKS50aGVuKGxpc3Q9PntcbiAgICBsb2NhbEFzeW5jU2V0KHtcbiAgICAgICAgJ19fcmVjb3JkTGlzdCc6IEpTT04uc3RyaW5naWZ5KGxpc3QpXG4gICAgfSlcbiAgICBMb2dnZXIuaW5mbygncmVjb3JkTGlzdCBSZWZyZXNoZWQnKVxuICB9KVxuICBhd2FpdCBnZXRMaXN0KCdzZWFyY2gnKS50aGVuKGxpc3Q9PntcbiAgICBsb2NhbEFzeW5jU2V0KHtcbiAgICAgICAgJ19fc2VhcmNoTGlzdCc6IEpTT04uc3RyaW5naWZ5KGxpc3QpXG4gICAgfSlcbiAgICBMb2dnZXIuaW5mbygnc2VhcmNoTGlzdCBSZWZyZXNoZWQnKVxuICB9KVxuICBjaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVJlcXVlc3QucmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2spOyBcbiAgY2hyb21lLndlYlJlcXVlc3Qub25CZWZvcmVSZXF1ZXN0LmFkZExpc3RlbmVyKFxuICAgICAgY2FsbGJhY2ssIGZpbHRlcigpLCBvcHRfZXh0cmFJbmZvU3BlY1xuICApOyAgXG59XG5cbi8vIGNyZWF0ZSBhbGFybSBmb3Igd2F0Y2hkb2cgYW5kIGZyZXNoIG9uIGluc3RhbGxlZC91cGRhdGVkLCBhbmQgc3RhcnQgZmV0Y2ggZGF0YVxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBMb2dnZXIuaW5mbygnb25JbnN0YWxsZWQuLi4uJyk7XG4gIGxvY2FsU3luY1NldCh7J19fc2VhcmNoTGlzdCc6J3t9J30pXG4gIGxvY2FsU3luY1NldCh7J19fcmVjb3JkTGlzdCc6J3t9J30pXG4gIHNjaGVkdWxlUmVxdWVzdCgpO1xuICBzY2hlZHVsZVdhdGNoZG9nKCk7XG4gIHN0YXJ0UmVxdWVzdCgpOyBcbn0pO1xuICAiLCJcbi8vaHR0cHM6Ly9naXRodWIuY29tL2JiMDEwZy9tYXRjaC1wYXR0ZXJuLXRvLXJlZ2V4cFxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgdmFsaWQgbWF0Y2ggcGF0dGVybiBpbnRvIGEgcmVndWxhciBleHByZXNzaW9uXG4gKiB3aGljaCBtYXRjaGVzIGFsbCBVUkxzIGluY2x1ZGVkIGJ5IHRoYXQgcGF0dGVybi5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBwYXR0ZXJuICBUaGUgcGF0dGVybiB0byB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJuIHtSZWdFeHB9ICAgICAgICAgICBUaGUgcGF0dGVybidzIGVxdWl2YWxlbnQgYXMgYSBSZWdFeHAuXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9ICAgICAgICBJZiB0aGUgcGF0dGVybiBpcyBub3QgYSB2YWxpZCBNYXRjaFBhdHRlcm5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hQYXR0ZXJuVG9SZWdleHAocGF0dGVybikge1xuICAgIGlmIChwYXR0ZXJuID09PSAnJykge1xuICAgICAgICByZXR1cm4gL14oPzpodHRwfGh0dHBzfHdzfHdzc3xmaWxlfGZ0cHxmdHBzKTpcXC9cXC8vO1xuICAgIH1cbiAgXG4gICAgY29uc3Qgc2NoZW1lU2VnbWVudCA9ICcoXFxcXCp8aHR0cHxodHRwc3x3c3x3c3N8ZmlsZXxmdHB8ZnRwcyknO1xuICAgIGNvbnN0IGhvc3RTZWdtZW50ID0gJyhcXFxcKnwoPzpcXFxcKlxcXFwuKT8oPzpbXi8qXSspKT8nO1xuICAgIGNvbnN0IHBhdGhTZWdtZW50ID0gJyguKiknO1xuICAgIGNvbnN0IG1hdGNoUGF0dGVyblJlZ0V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICAgIGBeJHtzY2hlbWVTZWdtZW50fTovLyR7aG9zdFNlZ21lbnR9LyR7cGF0aFNlZ21lbnR9JGBcbiAgICApO1xuICBcbiAgICBjb25zdCBtYXRjaCA9IG1hdGNoUGF0dGVyblJlZ0V4cC5leGVjKHBhdHRlcm4pO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgXCIke3BhdHRlcm59XCIgaXMgbm90IGEgdmFsaWQgTWF0Y2hQYXR0ZXJuYCk7XG4gICAgfVxuICBcbiAgICBsZXQgWywgc2NoZW1lLCBob3N0LCBwYXRoXSA9IG1hdGNoO1xuICAgIGlmICghaG9zdCAmJiBzY2hlbWUgIT09ICdmaWxlJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBcIiR7cGF0dGVybn1cIiBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgaG9zdGApO1xuICAgIH1cbiAgXG4gICAgY29uc3Qgc2NoZW1lUmVnZXggPSBzY2hlbWUgPT09ICcqJyA/ICcoaHR0cHxodHRwc3x3c3x3c3MpJyA6IHNjaGVtZTtcbiAgXG4gICAgbGV0IGhvc3RSZWdleCA9ICcnO1xuICAgIGlmIChob3N0KSB7XG4gICAgICAgIGlmIChob3N0ID09PSAnKicpIHtcbiAgICAgICAgICAgIGhvc3RSZWdleCA9ICdbXi9dKz8nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGhvc3Quc3RhcnRzV2l0aCgnKi4nKSkge1xuICAgICAgICAgICAgICAgIGhvc3RSZWdleCA9ICcoPzpbXi9dKz9cXFxcLik/JztcbiAgICAgICAgICAgICAgICBob3N0ID0gaG9zdC5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBob3N0UmVnZXggKz0gaG9zdC5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJyk7XG4gICAgICAgIH1cbiAgICB9XG4gIFxuICAgIGxldCBwYXRoUmVnZXggPSAnLz8nO1xuICAgIGlmIChwYXRoKSB7XG4gICAgICAgIGlmIChwYXRoID09PSAnKicpIHtcbiAgICAgICAgICAgIHBhdGhSZWdleCA9ICcoLy4qKT8nO1xuICAgICAgICB9IGVsc2UgaWYgKHBhdGguY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgICAgICAgIHBhdGhSZWdleCA9IGAvJHtwYXRoLnJlcGxhY2UoL1xcLi9nLCAnXFxcXC4nKS5yZXBsYWNlKC9cXCovZywgJy4qPycpfWA7XG4gICAgICAgIH1cbiAgICB9XG4gIFxuICAgIGNvbnN0IHJlZ2V4ID0gYF4ke3NjaGVtZVJlZ2V4fTovLyR7aG9zdFJlZ2V4fSR7cGF0aFJlZ2V4fSRgO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWF0Y2hQYXR0ZXJuVG9SZWdleHAiLCJleHBvcnQgY29uc3QgY2hyb21lU3RvcmVBc3luY0dldCA9IChrZXkpPT57XG4gICAgLy8gY29uc29sZS5sb2coJ2dldEtleScsa2V5KVxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtrZXldLChyZXN1bHQpPT57XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdFtrZXldKVxuICAgICAgICB9KVxuICAgIH0pLmNhdGNoKGU9PntcbiAgICAgICAgLy8gY29uc29sZS5sb2coZSlcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxufVxuXG5leHBvcnQgY29uc3QgY2hyb21lU3RvcmVTZXQgPSAob2JqZWN0KT0+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KG9iamVjdCwoKT0+e1xuICAgICAgICAgICAgcmVzb2x2ZShvYmplY3QpXG4gICAgICAgIH0pXG4gICAgfSkuY2F0Y2goZT0+e1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH0pXG59XG5cblxuZXhwb3J0IGNvbnN0IGxvY2FsQXN5bmNHZXQgPSAoa2V5KT0+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICB9KS5jYXRjaChlPT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGxvY2FsQXN5bmNTZXQgPSAob2JqZWN0KT0+e1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLHJlamVjdCk9PntcbiAgICAgICAgbGV0IHN0b3JlZCA9IG9iamVjdFtPYmplY3Qua2V5cyhvYmplY3QpWzBdXVxuICAgICAgICBpZih0eXBlb2Ygc3RvcmVkICE9ICdzdHJpbmcnKXtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbG9jYWxTeW5jU2V0IG11c3Qgc2V0IGEgc3RyaW5nIGtleSBhbmQgdmFsdWUuICBVc2UgSlNPTi5zdHJpbmdpZnkgaWYgb2JqZWN0IHN0b3JhZ2UgaXMgbmVlZGVkLicpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdDogYW55ID0gbG9jYWxTdG9yYWdlLnNldEl0ZW0oT2JqZWN0LmtleXMob2JqZWN0KVswXSwgb2JqZWN0W09iamVjdC5rZXlzKG9iamVjdClbMF1dKVxuICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICB9KS5jYXRjaChlPT57XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGUpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfSlcbn1cblxuXG5cbmV4cG9ydCBjb25zdCBsb2NhbFN5bmNHZXQgPSAoa2V5KT0+e1xuICAgIC8vIGNvbnNvbGUubG9nKCdnZXRTeW5jIEtleScsa2V5KVxuICAgIGxldCByZXN1bHQ6IGFueSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBjb25zdCBsb2NhbFN5bmNTZXQgPSAob2JqZWN0KT0+e1xuICAgIC8vIGNvbnNvbGUubG9nKCdzZXRTeW5jIE9iamVjdCcsT2JqZWN0LmtleXMob2JqZWN0KVswXSwgb2JqZWN0W09iamVjdC5rZXlzKG9iamVjdClbMF1dKVxuICAgIGxldCBzdG9yZWQgPSBvYmplY3RbT2JqZWN0LmtleXMob2JqZWN0KVswXV1cbiAgICBpZih0eXBlb2Ygc3RvcmVkICE9ICdzdHJpbmcnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdsb2NhbFN5bmNTZXQgbXVzdCBzZXQgYSBzdHJpbmcga2V5IGFuZCB2YWx1ZS4gIFVzZSBKU09OLnN0cmluZ2lmeSBpZiBvYmplY3Qgc3RvcmFnZSBpcyBuZWVkZWQuJylcbiAgICB9XG4gICAgbGV0IHJlc3VsdDogYW55ID0gbG9jYWxTdG9yYWdlLnNldEl0ZW0oT2JqZWN0LmtleXMob2JqZWN0KVswXSwgb2JqZWN0W09iamVjdC5rZXlzKG9iamVjdClbMF1dKVxuICAgIHJldHVybiByZXN1bHRcbn1cbiIsImltcG9ydCBtYXRjaFBhdHRlcm5Ub1JlZ2V4cCBmcm9tICcuL21hdGNoZXInXG5pbXBvcnQgeyBsb2NhbEFzeW5jR2V0LCBsb2NhbEFzeW5jU2V0LCBsb2NhbFN5bmNHZXQgfSBmcm9tICcuL3N0b3JhZ2VDaHJvbWUnXG5cbmRlY2xhcmUgdmFyIHJlcXVpcmU6IGFueVxuXG5sZXQgcmVjb3JkTGlzdCA9IHJlcXVpcmUoJy4vcmVjb3JkTGlzdC5qc29uJylcbmxldCBzZWFyY2hMaXN0ID0gcmVxdWlyZSgnLi9zZWFyY2hMaXN0Lmpzb24nKVxubGV0IHByZWZlcmVuY2VMaXN0ID0ge31cbmxldCBjYWNoZVN0YW1wID0gRGF0ZS5ub3coKVxuXG4vKiAgIFxuc2l0ZTogaHR0cDovL3d3dy5yZWR6ZXBwZWxpbnBpenphLmNvbS9NZW51Lmh0bWxcbmNoZWNrOiByZWR6ZXBwZWxpbnBpenphLmNvbSBUUlVFXG5jaGVjazogd3d3LnJlZHplcHBlbGlucGl6emEuY29tIFRSVUVcbmNoZWNrOiB3d3cucmVkemVwcGVsaW5waXp6YS5jb20vTWVudS5odG1sIFRSVUVcbmNoZWNrTCB3d3cucmVkemVwcGVsaW5waXp6YS5jb20vSG9tZS5odG1sIEZBTFNFXG4qL1xuXG4vKlxuc2l0ZTogaHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9jb25maWd1cmF0aW9uXG5jaGVjazogd2VicGFjay5qcy5vcmcvY29uZmlndXJhdGlvbi93YXRjaCBUUlVFXG5jaGVjazogd2VicGFjay5qcy5vcmcvY29udHJpYnV0ZSBGQUxTRVxuY2hlY2s6IHdlYnBhY2suanMub3JnIFRSVUVcbiovXG5cbi8qKlxuICogQ2FsbGJhY2sgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgdGhlIHdlYlJlcXVlc3QgaW50ZXJydXB0aW9ucyBhcmUgc2VudCB0bywgcHJvdmlkZWQgdGhleSBwYXNzIHRoZSBmaWx0ZXJcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyBhIG1hdGNoIGhhcyBiZWVuIG1hZGVcbiAqIEBwYXJhbSBkZXRhaWxzIHRoZSB3ZWJSZXF1ZXN0IERldGFpbHMgb2JqZWN0IHBhc3NlZCBpbnRvIHRoZSBkZWZhdWx0IENhbGxiYWsgRnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGxiYWNrID0gZnVuY3Rpb24oZGV0YWlscykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFjaycsIGRldGFpbHMpXG4gICAgLy8gY29uc29sZS5sb2coJ3ByZScsIHNlYXJjaExpc3QpXG5cbiAgICByZWZyZXNoTGlzdHMoKVxuXG4gICAgLy8gdXNlIHRoZSBsaXN0cyB0byBydW4geW91ciBjaGVja3NcbiAgICBsZXQga2V5ID0gbWF0Y2hVcmwoZGV0YWlscy51cmwsIHNlYXJjaExpc3QpXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gbWF0Y2hcbiAgICBpZihrZXkgPCAwKXtcbiAgICAgIHJldHVybiB7Y2FuY2VsOmZhbHNlfVxuICAgIH1cblxuICAgIGxldCB7IGRvbWFpbiwgaWdub3JlVW50aWwgfSA9IGdldERvbWFpbkFuZElnbm9yZShrZXksIHNlYXJjaExpc3QsIHByZWZlcmVuY2VMaXN0KVxuXG4gICAgLy8gY29uc29sZS5sb2coZG9tYWluLCBrZXksIGlnbm9yZVVudGlsKVxuICAgIC8vIGlmIGlnbm9yZVVudGlsIGlzIHN0aWxsIGluIGVmZmVjdCwgY2Fycnkgb24uXG4gICAgaWYoISFpZ25vcmVVbnRpbCAmJiBEYXRlLm5vdygpIDwgaWdub3JlVW50aWwpe1xuICAgICAgcmV0dXJuIHtjYW5jZWw6ZmFsc2V9XG4gICAgfVxuXG4gICAgLy8gZWxzZSBibG9jayB0aGUgcGFnZSAgXG4gICAgbGV0IG9yaWdpbmFsID0gZW5jb2RlVVJJQ29tcG9uZW50KGRldGFpbHMudXJsKVxuICAgIHJldHVybiB7cmVkaXJlY3RVcmw6IGBjaHJvbWUtZXh0ZW5zaW9uOi8vJHtjaHJvbWUucnVudGltZS5pZH0vaW5kZXguaHRtbCMvYmxvY2s/a2V5PSR7ZG9tYWlufSZvcmlnaW5hbD0ke29yaWdpbmFsfWB9O1xuICBcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcigpe1xuICBzZWFyY2hMaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN5bmNHZXQoJ19fc2VhcmNoTGlzdCcpKSB8fCBzZWFyY2hMaXN0XG4gIGlmKE9iamVjdC5rZXlzKHNlYXJjaExpc3QpLmxlbmd0aCA8PSAwKSB7XG4gICAgcmV0dXJuIHt1cmxzOiBbJyo6Ly9leGFtcGxlLmNvbS8nXX1cbiAgfVxuICB2YXIgc2VhcmNoTGlzdEFycmF5ID0gT2JqZWN0LmtleXMoc2VhcmNoTGlzdCkubWFwKHVybD0+YCo6Ly8ke3VybH1gKVxuICB2YXIgZmlsdGVyID0ge3VybHM6IHNlYXJjaExpc3RBcnJheX1cbiAgcmV0dXJuIGZpbHRlciAgXG59XG5cblxuXG5cbi8vIEF0dGFjaCB0aGUgYWxhcm1zIHRvIHRoZSBcblxuZnVuY3Rpb24gbWF0Y2hVcmwodXJsLCBzZWFyY2hMaXN0KXtcbiAgbGV0IHNlYXJjaGFibGUgPSBPYmplY3Qua2V5cyhzZWFyY2hMaXN0KVxuICBsZXQga2V5ID0gc2VhcmNoYWJsZS5maW5kSW5kZXgocGF0dGVybj0+e1xuICAgIC8vIFRoaXMgYXR0ZW1wdHMgdG8gdXNlIHRoZSBzYW1lIG1hdGNoaW5nIGFsZ29yaXRobSBhcyBjaHJvbWUgc28gd2UgY2FuIGZpbmQgb3V0IFxuICAgIC8vIHdoaWNoIHJlY29yZCBpcyB0aGUgb25lIHdlJ3JlIGxvb2tpbmcgYXRcbiAgICBsZXQgcmVnZXggPSBtYXRjaFBhdHRlcm5Ub1JlZ2V4cCgnKjovLycrcGF0dGVybik7XG4gICAgcmV0dXJuICh1cmwpLm1hdGNoKHJlZ2V4KVxuICB9KVxuICAvLyBjb25zb2xlLmxvZygna2V5JyxrZXkpXG4gIHJldHVybiBrZXlcbn1cblxuZnVuY3Rpb24gZ2V0RG9tYWluQW5kSWdub3JlKGtleSwgc2VhcmNoTGlzdCwgdGltZW91dExpc3Qpe1xuICBsZXQgZG9tYWluID0gc2VhcmNoTGlzdFtPYmplY3Qua2V5cyhzZWFyY2hMaXN0KVtrZXldXSB8fCBcIlwiXG4gIGxldCBpZ25vcmVVbnRpbCA9IHRpbWVvdXRMaXN0W2RvbWFpbl0gfHwgbnVsbFxuICByZXR1cm4geyBkb21haW4sIGlnbm9yZVVudGlsIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaExpc3RzKCl7XG4gICAgLy8gTWFrZSBzdXJlIGxpc3RzIGFyZSB1cC10by1kYXRlXG4gICAgLy8gT25seSByZWZyZXNoIHRoaXMgbGlzdCBldmVyeSBob3VyIHRvIGtlZXAgdGhlIGNhbGxiYWNrIGxpZ2h0d2VpZ2h0ICBcbiAgICBpZihEYXRlLm5vdygpID4gY2FjaGVTdGFtcCArMTAwMCo2MCo2MCl7XG4gICAgICByZWNvcmRMaXN0ICAgICAgPSBKU09OLnBhcnNlKGF3YWl0IGxvY2FsQXN5bmNHZXQoJ19fcmVjb3JkTGlzdCcpKSB8fCByZWNvcmRMaXN0XG4gICAgICBzZWFyY2hMaXN0ICAgICAgPSBKU09OLnBhcnNlKGF3YWl0IGxvY2FsQXN5bmNHZXQoJ19fc2VhcmNoTGlzdCcpKSB8fCBzZWFyY2hMaXN0XG4gICAgICBwcmVmZXJlbmNlTGlzdCAgPSBKU09OLnBhcnNlKGF3YWl0IGxvY2FsQXN5bmNHZXQoJ19fcHJlZmVyZW5jZUxpc3QnKSkgfHwgcHJlZmVyZW5jZUxpc3RcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9