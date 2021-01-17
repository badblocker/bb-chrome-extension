import * as React from 'react';
import { useState, useEffect } from 'react'
import * as ReactDOM from "react-dom"
import * as qs from 'qs/lib'

// @ts-ignore
import background from "../img/background.svg";

// import "tailwindcss/tailwind.css"
import "../styles/index.css"



async function getRecord(){
    let querystring = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    console.log(querystring.key)
    let record
    return new Promise<any>((resolve,reject)=>{
        chrome.storage.local.get([querystring.key],(result)=>{
            resolve(result[querystring.key])
        })
    })

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


function App() {
    const [data, setData] = useState({
        name:"",
        sources:[],
        issues:[],
        alternative:[],
        alt_name:"",
        alt_reason:"",
        alt_link:""
    });
    useEffect(() => {
        getRecord().then((record={})=>{
            console.log('record', record)
            let alts = record.alternatives || []
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
        <div className="popup-padded relative min-h-screen">
            <div className="container px-10 py-8 mx-auto">
                <div className="z-10 relative">
                    <h1 className="headerfont warning md:pb-10 leading-none">Warning! </h1>
                    <div className="lg:absolute top-0 right-0 flex text-2xl pt-2 pb-8">
                        <div className="headerfont text-blue underline pr-8">
                            About
                        </div>
                        <div className="headerfont text-blue underline">
                            Submit A Block
                        </div>
                    </div>
                    <h3 className="headerfont text-red text-3xl leading-5 tracking-wide">You are Visiting</h3>
                    <div className="text-blue italic text-4xl pb-10">{ data.name }</div>
                    <h3 className="headerfont text-red text-3xl leading-5 tracking-wide pb-2">Which has been connected to</h3>
                    <div><i>{(data.issues||[]).map(IssueBlock)}</i></div>
                    <h3 className="headerfont text-red text-3xl leading-5 pt-10 tracking-wide">Try this alternative</h3>
                    <div className="text-blue italic text-4xl">{ data.alt_name }</div>
                    <div className="text-blue italic text-xl leading-tight">{ data.alt_reason}</div>
                    <div style={{maxWidth:305}} className="mt-7">
                        <button type="button" className="w-full button-slanted headerfont inline-flex items-center px-4 py-1 border border-transparent rounded-md shadow-sm  font-medium bg-blue hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">
                            <span className="w-full text-center button-slanted-content pt-1 tracking-wider text-2xl text-white ">Go to Alternative</span>
                        </button>
                    </div>
                    <div className="mt-2">
                        <button type="button" className="mr-2 button-slanted inline-flex items-center px-4 py-1 text-blue hover:text-white border border-blue rounded-md shadow-sm  font-medium bg-white hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">
                            <span className="w-full text-center button-slanted-content  tracking-wide text-base ">Ignore Once</span>
                        </button>
                        <button type="button" className="button-slanted inline-flex items-center px-4 py-1 text-blue hover:text-white border border-blue rounded-md shadow-sm  font-medium bg-white hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">
                            <span className="w-full text-center button-slanted-content  tracking-wide text-base ">Ignore Forever</span>
                        </button>
                    </div>
                    
                    
                </div>
                
            </div>
            <div className="bottom-0 flex fixed z-0 min-h-screen min-w-full flex-col-reverse">
                    <div className="self-end">
                        <img 
                            className="h-screen"
                            style={{maxHeight: 860}}
                            src={background}>
                        </img>
                    </div>
            </div>
        </div>

        
    )
}

// --------------

ReactDOM.render(
    <App />,
    document.getElementById('root')
)