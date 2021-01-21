

export const localAsyncGet = (key)=>{
    // console.log('getKey',key)
    return new Promise<any>((resolve,reject)=>{
        chrome.storage.local.get([key],(result)=>{
            resolve(result[key])
        })
    }).catch(e=>{
        // console.log(e)
        return null
    })
}

export const localAsyncSet = (object)=>{
    return new Promise<any>((resolve,reject)=>{
        chrome.storage.local.set(object,()=>{
            resolve(object)
        })
    }).catch(e=>{
        // console.log(e)
        return null
    })
}



export const localSyncGet = (key)=>{
    // console.log('getSync Key',key)
    let result: any = localStorage.getItem(key)
    return result
}

export const localSyncSet = (object)=>{
    // console.log('setSync Object',Object.keys(object)[0], object[Object.keys(object)[0]])
    let stored = object[Object.keys(object)[0]]
    if(typeof stored != 'string'){
        throw new Error('localSyncSet must set a string key and value.  Use JSON.stringify if object storage is needed.')
    }
    let result: any = localStorage.setItem(Object.keys(object)[0], object[Object.keys(object)[0]])
    return result
}
