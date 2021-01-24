import matchPatternToRegexp from './matcher'
import { localAsyncGet, localAsyncSet, localSyncGet } from './storageChrome'

declare var require: any

let recordList = require('./recordList.json')
let searchList = require('./searchList.json')
let preferenceList = {}
let cacheStamp = Date.now()

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
export const callback = function(details) {
    // console.log('callback', details)
    // console.log('pre', searchList)

    refreshLists()

    // use the lists to run your checks
    let key = matchUrl(details.url, searchList)
    // if there is no match
    if(key < 0){
      return {cancel:false}
    }

    let { domain, ignoreUntil } = getDomainAndIgnore(key, searchList, preferenceList)

    // console.log(domain, key, ignoreUntil)
    // if ignoreUntil is still in effect, carry on.
    if(!!ignoreUntil && Date.now() < ignoreUntil){
      return {cancel:false}
    }

    // else block the page  
    let original = encodeURIComponent(details.url)
    return {redirectUrl: `chrome-extension://${chrome.runtime.id}/index.html#/block?key=${domain}&original=${original}`};
  
};


export function filter(){
  searchList = JSON.parse(localSyncGet('__searchList')) || searchList
  if(Object.keys(searchList).length <= 0) {
    return {urls: ['*://example.com/']}
  }
  var searchListArray = Object.keys(searchList).map(url=>`*://${url}`)
  var filter = {urls: searchListArray}
  return filter  
}




// Attach the alarms to the 

function matchUrl(url, searchList){
  let searchable = Object.keys(searchList)
  let key = searchable.findIndex(pattern=>{
    // This attempts to use the same matching algorithm as chrome so we can find out 
    // which record is the one we're looking at
    let regex = matchPatternToRegexp('*://'+pattern);
    return (url).match(regex)
  })
  // console.log('key',key)
  return key
}

function getDomainAndIgnore(key, searchList, timeoutList){
  let domain = searchList[Object.keys(searchList)[key]] || ""
  let ignoreUntil = timeoutList[domain] || null
  return { domain, ignoreUntil }
}

async function refreshLists(){
    // Make sure lists are up-to-date
    // Only refresh this list every hour to keep the callback lightweight  
    if(Date.now() > cacheStamp +1000*60*60){
      recordList      = JSON.parse(await localAsyncGet('__recordList')) || recordList
      searchList      = JSON.parse(await localAsyncGet('__searchList')) || searchList
      preferenceList  = JSON.parse(await localAsyncGet('__preferenceList')) || preferenceList
    }
}
