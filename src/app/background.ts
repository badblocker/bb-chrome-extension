import { localSyncSet, localSyncGet, localAsyncSet } from './storageChrome'
import { callback, filter } from './webRequest'
import Logger from 'js-logger'

Logger.useDefaults();
Logger.setLevel(Logger.INFO)
console.log(Logger.getLevel())

var opt_extraInfoSpec = [
    "blocking",
    "requestBody"
];

async function getList(name){
  let url = `https://raw.githubusercontent.com/badblocker/bb-chrome-extension/main/dist/js/${name}List.json`
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "text/plain");
  
  var requestOptions:object = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  let newList = await fetch(url, requestOptions)
    .then(response => response.json())
    .catch(error => Logger.error(error));
  //   console.log(newList)
  return newList
}
 

// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
  Logger.info('onStartup....');
  startRequest();
});
  
// alarm listener
chrome.alarms.onAlarm.addListener(alarm => {
  // if watchdog is triggered, check whether refresh alarm is there
  if (alarm && alarm.name === 'watchdog') {
    chrome.alarms.get('refresh', alarm => {
      if (alarm) {
        Logger.info('Refresh alarm exists. Yay.');
      } else {
        // if it is not there, start a new request and reschedule refresh alarm
        Logger.info("Refresh alarm doesn't exist, starting a new one");
        startRequest();
        scheduleRequest();
      }
    });
  } else {
    // if refresh alarm triggered, start a new request
    startRequest();
  }
});




// schedule a new fetch every 30 minutes
function scheduleRequest() {
  Logger.info('schedule refresh alarm to 30 minutes...');
  chrome.alarms.create('refresh', { periodInMinutes: 2 });
}
  


// schedule a watchdog check every 5 minutes
function scheduleWatchdog() {
  Logger.info('schedule watchdog alarm to 5 minutes...');
  chrome.alarms.create('watchdog', { periodInMinutes: 1 });
}
  


// fetch data and save to local storage
async function startRequest() {
  Logger.info('start HTTP Request...');
  await getList('record').then(list=>{
    console.log(list)
    localAsyncSet({
        '__recordList': JSON.stringify(list)
    })
    Logger.info('recordList Refreshed', list)
  })
  await getList('search').then(list=>{
    console.log(list)
    localAsyncSet({
        '__searchList': JSON.stringify(list)
    })
    Logger.info('searchList Refreshed', list)
  })
  let recordList = JSON.parse(localSyncGet('__recordList'))
  let searchList = JSON.parse(localSyncGet('__searchList'))
  console.log('refreshed all', recordList, searchList)
  chrome.webRequest.onBeforeRequest.removeListener(callback); 
  chrome.webRequest.onBeforeRequest.addListener(
      callback, filter(), opt_extraInfoSpec
  );  
}

// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
  Logger.info('onInstalled....');
  localSyncSet({'__searchList':'{}'})
  localSyncSet({'__recordList':'{}'})
  scheduleRequest();
  scheduleWatchdog();
  startRequest(); 
});
  