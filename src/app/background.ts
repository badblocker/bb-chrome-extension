import micromatch from 'micromatch'
import matchPatternToRegexp from './matcher'
import recordList from './recordList'
import searchList from './searchlist'


  //<a href="https://www.freepik.com/vectors/people">People vector created by freepik - www.freepik.com</a>
  //<a href="https://www.freepik.com/vectors/people">People vector created by pch.vector - www.freepik.com</a>

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


var callback = function(details) {
    console.log(details)
    var a = document.createElement('a');
    a.href = details.url;
    let searchable = Object.keys(searchList)
    let key = searchable.findIndex(pattern=>{
      // console.log('pattern',pattern)
      let regex = matchPatternToRegexp('*://'+pattern);
      // console.log('regex',regex)
      return (details.url).match(regex)
    })
    
    let name = searchList[Object.keys(searchList)[key]]

    console.log('key', key)
    // console.log(name)
    // console.log(searchList[name])
    console.log('record', recordList[name])
    
    let record = recordList[name]
    let toStore = {}
    toStore[name] = record

    console.log('toStore',toStore)
    chrome.storage.local.set(toStore,()=>{
      console.log(chrome.storage.local.get(name))
    })

    return {redirectUrl: `chrome-extension://${chrome.runtime.id}/options.html?key=${name}`};

    // Block the request
    // return {cancel: true};
  
    
};


var searchListArray = Object.keys(searchList).map(url=>`*://${url}`)

var filter = {urls: searchListArray}

var opt_extraInfoSpec = [
  "blocking",
  "requestBody"
];

chrome.webRequest.onBeforeRequest.addListener(
    callback, filter, opt_extraInfoSpec
);

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});


  // "content_security_policy": "default-src 'self';"
  
  // "browser_action": {
  //   "default_title": "TSRWPCX",
  //   "default_popup": "popup.html"
  // },
      // "content_scripts": [
      //   {
      //     "matches": [
      //       "https://*/*"
      //     ],
      //     "js": [
      //       "js/content.js"
      //     ]
      //   }
      // ]
  
  