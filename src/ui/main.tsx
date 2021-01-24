import * as React from 'react';
import { useState, useEffect } from 'react'
import * as ReactDOM from "react-dom"
import * as qs from 'qs/lib'
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Switch, Route, Link, HashRouter, useLocation } from 'react-router-dom'


// LOCAL FILES
import AboutPage from './about'
import {localSyncSet, localSyncGet} from '../app/storageChrome'
import "../styles/index.css"

// ASSETS
// @ts-ignore
import background from "../img/background.svg" ;




function TransitionSwitch(props){
    let location = useLocation();

    let style = `
        .fade-enter{
            opacity: 0;
        }
        .fade-exit{
            opacity: 1;
        }
        .fade-enter-active{
            opacity: 1;
        }
        .fade-exit-active{
            opacity: 0;
        }
        .fade-enter-active,
        .fade-exit-active{
            transition: opacity 200ms;
        }
    `
    console.log(location)
    return (
        <React.Fragment>
            <style>{style}</style>
            <SwitchTransition>
                <CSSTransition
                    key={location.pathname}
                    classNames="fade"
                    timeout={200}
                >
                    <Switch location={location}>
                        {props.children}
                    </Switch>
                </CSSTransition>
            </SwitchTransition>
        </React.Fragment>
       
    )
}


async function getRecord(){
    let search = window.location.hash.match(/\?.*/)[0]
    // console.log('getRecord search',window.location)
    // let search = ""
    let querystring = qs.parse(search, { ignoreQueryPrefix: true })
    // console.log('query.key', querystring.key)
    let record = JSON.parse(localSyncGet(querystring.key))
    // console.log(record)
    return { record, key:querystring.key }
}

function getOriginal() {
    let search = window.location.hash.match(/\?.*/)[0]
    let querystring = qs.parse(search, { ignoreQueryPrefix: true })
    return querystring.original
}


// function setIgnore(name,date){
//   return new Promise((resolve, reject) => {
//         chrome.storage.local.set(
//             { "blockdate": Date.now()},
//         loadScript(src, (err, script) => {
//           if (err) reject(err);
//           else resolve(script);
//         });
//    });
// }


async function ignoreOnce(data, original){
    let oneHour = 1000*60*60*12
    // let twelveHours = 10000
    let { record, key } = await getRecord()
    // console.log('ignoreOnce')
    localSyncSet({ 
        [key]: JSON.stringify({
            ...record,
            ignoreUntil: Date.now() + oneHour})
    })

    // console.log('decodeOriginal', decodeURIComponent(original), original)

    window.location.href = decodeURIComponent(original)
    // console.log('io', blockdate)
}
async function ignoreForever(data, original){
    let sixMonths = 1000*60*60*24*30*6
    let { record, key } = await getRecord()
    localSyncSet({ 
        [key]: JSON.stringify({
            ...record,
            ignoreUntil: Date.now() + sixMonths})
    })
    // console.log('decodeOriginal', decodeURIComponent(original), original)

    window.location.href = decodeURIComponent(original)
    // window.location.href = decodeURIComponent(original)

}

function clearStorage(){
    console.log('Clearing Storage')
    localSyncSet({'__searchList':'{}'})
    localSyncSet({'__recordList':'{}'})
}

function IssueReference(links = []){
    return (
        <span>
            {links.map((link = {}, i)=>{
                return (
                    <sup className="text-red" key={i}>
                        {/* {(i!=0) ? ' ' : '' } */}
                        <a className="underline" href={link}>
                            {i+1}
                        </a>
                        &nbsp;&nbsp;
                    </sup>
                )
            })}
        </span>
    )
}

function IssueBlock(props,i){
    
    console.log(props)
    return (
        <div className="text-blue text-xl leading-relaxed" key={i}>
            ... {props.text} {IssueReference(props.links)}
        </div>
    )
}

function BlockPage(){
    const [data, setData] = useState({
        name:"",
        sources:[],
        issues:[],
        alternative:[],
        alt_name:"",
        alt_reason:"",
        alt_link:""
    });
    let original = getOriginal()
    console.log('original', original)
    useEffect(() => {
        getRecord().then((result)=>{
            let {record={}, key} = result
            console.log('record', record)
            let alts = (record||{}).alternatives || []
            let alt = alts[Math.floor(Math.random() * alts.length)] || {}
            setData({
                ...record,
                alt_name: alt.name || "",
                alt_reason: alt.reason || "",
                alt_link: alt.link || ""
            })
        })
    },[]);
    return (
        <div>
            <h1 className="headerfont warning md:pb-10 leading-none">Warning! </h1>
            <h3 className="headerfont text-red text-3xl leading-5 tracking-wide">You are Visiting</h3>
            <div className="text-blue italic text-4xl pb-10">{ data.name }</div>
            <h3 className="headerfont text-red text-3xl leading-5 tracking-wide pb-2">Which has been connected to</h3>
            <div><i>{(data.issues||[]).map(IssueBlock)}</i></div>
            <h3 className="headerfont text-red text-3xl leading-5 pt-10 tracking-wide">Try this alternative</h3>
            <div className="text-blue italic text-4xl">{ data.alt_name }</div>
            <div className="text-blue italic text-xl leading-tight">{ data.alt_reason}</div>
            <div style={{maxWidth:305}} className="mt-7">
                <a href={data.alt_link}>
                    <button type="button" className="transition-all w-full button-slanted headerfont inline-flex items-center px-4 py-1 border border-transparent rounded-md shadow-sm  font-medium bg-blue hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">
                        <span className="w-full text-center button-slanted-content pt-1 tracking-wider text-2xl text-white ">Go to Alternative</span>
                    </button>
                </a>
                
            </div>
            <div className="mt-2">
                    <button type="button" className="transition-all mr-2 button-slanted inline-flex items-center px-4 py-1 text-blue hover:text-white border border-blue rounded-md shadow-sm  font-medium bg-white hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
                        onClick={()=>ignoreOnce(data, original)}>
                        <span className="w-full text-center button-slanted-content  tracking-wide text-base ">Ignore Today</span>
                    </button>
                <button type="button" className="transition-all button-slanted inline-flex items-center px-4 py-1 text-blue hover:text-white border border-blue rounded-md shadow-sm  font-medium bg-white hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
                    onClick={()=>ignoreForever(data, original)}>
                    <span className="w-full text-center button-slanted-content  tracking-wide text-base ">Ignore Forever</span>
                </button>
            </div>
        </div>
    )
}

function App() {
    // const [page, setPage] = useState("block")
    // const [match, params] = useRoute("/users/:id");
    let search = window.location.hash.match(/\?.*/)[0]

    return (
        <div className="popup-padded relative min-h-screen">
            <div className="container relative px-10 py-8 mx-auto">
                <div className="lg:absolute top-0 right-0 flex text-2xl pt-2 pb-8 mt-8 z-10">
                    <div className="headerfont text-blue underline pr-8">
                        <TransitionSwitch>
                                <Route path="/block"><Link to={{ pathname: '/about', search}}>About</Link></Route>
                                <Route path="/about"><Link to={{ pathname: '/block', search}}>Back</Link></Route>
                        </TransitionSwitch>
                    </div>
                    <div className="headerfont text-blue underline">
                        <a href="https://forms.gle/yEsekiPUTbYTUJeQ7" target="_blank">Suggest A Block</a>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="z-10 relative col-start-1 col-end-12 lg:col-end-8">
                        {/* <ErrorBoundary> */}
                            {/* @ts-ignore */}

                            <TransitionSwitch>
                                <Route path="/about"><AboutPage/></Route>
                                <Route path="/block"><BlockPage/></Route>
                            </TransitionSwitch>
                            {/* <BlockPage/> */}
                        {/* </ErrorBoundary> */}
                    </div>
                </div>
            </div>
            <div className="absolute left-0 bottom-0 z-10 px-7 py-2">
                <a href="http://www.freepik.com">Designed by Freepik</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <a href="https://github.com/badblocker/bb-chrome-extension">Open Source</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                Copyright, BadBlocker 2021         
            </div>
            <div className="absolute right-0 bottom-0 z-10 px-7 py-2">
                <button onClick={clearStorage}>&#928;</button>       
            </div>
            <div className="bottom-0 right-0 flex fixed z-0 min-h-screenflex-col-reverse"
                style={{
                    maxWidth: "80%",
                    minWidth: "80%"
                }}
                >
                    <div 
                        className="self-end h-screen"
                        style={{maxHeight: 700}}
                    >
                        <img 
                            className="max-h-full bottom-0 absolute right-0"
                            src={background}>
                        </img>
                    </div>
            </div>
        </div>
    )
}

// --------------
ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>,
    // <BrowserRouter>
    //     <App />
    // </BrowserRouter>
    document.getElementById('root')
)
