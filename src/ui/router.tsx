import * as React from 'react';
import { useState, useEffect } from 'react'
import * as ReactDOM from "react-dom"
import * as qs from 'qs/lib'
import { Link, Route, Router } from "wouter";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
// @ts-ignore
const currentLocation = () => {
  let result = window.location.hash.match(/^#.*?(?=\?)/)[0]
  console.log('result',result)
  console.log('location', window.location)
  // window._search = search
  return result.replace(/^#/,"")
};

const navigate = (to) => {
  console.log("to",to)
  let params = window.location.hash.match(/\?.*/)[0]
  return (
    window.location.hash = to + params
  )
};

const useHashLocation = () => {
  // console.log('in the hashLocation')
  const [loc, setLoc] = useState(currentLocation());
  // console.log('loc', loc)
  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => setLoc(currentLocation());

    // subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return [loc, navigate];
};
export default useHashLocation