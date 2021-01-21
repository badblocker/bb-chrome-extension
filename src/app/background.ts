import { data } from 'autoprefixer';
import micromatch from 'micromatch'
import matchPatternToRegexp from './matcher'
import recordList from './recordList'
import searchList from './searchlist'
import {localAsyncGet, localAsyncSet, localSyncSet, localSyncGet} from './storageChrome'



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


function matchUrl(url){
  let searchable = Object.keys(searchList)
  let key = searchable.findIndex(pattern=>{
    // This attempts to use the same matching algorithm as chrome so we can find out 
    // which record is the one we're looking at
    let regex = matchPatternToRegexp('*://'+pattern);
    return (url).match(regex)
  })
  return key
}

function refreshStoredRecord(key){
  let domain = searchList[Object.keys(searchList)[key]] || ""
  // console.log('\n\nrefreshStoredRecord domain', domain)
  let storedRecord
  try{
    storedRecord = localSyncGet([domain])
    // console.log('storedRecord', storedRecord)
    storedRecord = JSON.parse(storedRecord || '{}') || {}
  }
  catch(err){
    console.log(err)
  }

  let record = {
    ...recordList[domain],
    ignoreUntil: storedRecord.ignoreUntil || null
  }
  localSyncSet({
   [domain]: JSON.stringify(record)
  })

  // console.log('record', domain, storedRecord, record)
  return { domain, ignoreUntil:(record ||{}).ignoreUntil }
}



var callback = function(details) {
    // This function assumes a match has been made
    // console.log(details)
    // let domain = 'redzeppelin.com'
    

    let key = matchUrl(details.url)
    let { domain, ignoreUntil } = refreshStoredRecord(key)

    // if ignoreUntil is still in effect, carry on.
    // console.log(domain, ignoreUntil)
    if(!!ignoreUntil && Date.now() < ignoreUntil){
      // console.log('ignoring until', ignoreUntil)
      return {cancel:false}
    }

    // else block the page  
    let original = encodeURIComponent(details.url)
    // return {redirectUrl: `chrome-extension://${chrome.runtime.id}/index.html#/block?key=${domain}&original=${original}`};
    return {redirectUrl: `chrome-extension://${chrome.runtime.id}/index.html#/block?key=${domain}&original=${original}`};
  
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
