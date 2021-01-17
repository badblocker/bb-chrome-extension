import * as React from 'react';
import { useState, useEffect } from 'react'
import * as ReactDOM from "react-dom"
import * as qs from 'qs/lib'
import "tailwindcss/tailwind.css"



import "../styles/popup.css"


function About() {
    return (
        <div className="about-section">
            <p> On January 6, 2021, U.S. President Donald Trump held a rally on the National Mall.  At that rally, 
                he advocated for the crowd to "fight like hell" and "take back their country" after incorrectly 
                and repeatedly claiming that he had won the 2020 Presidential Election.
            </p>
            <p> Many in that rally's crowd had shown up to do just that, with the intent and tools to attack
                the United States Capitol and ultimately kidnap or kill members of Congress.  In the days that followed the attack, some of 
                these rioters took to social media to brag about the modicum of "success" they had achieved: 4 deaths, 1 murder, 
                and numerous violent assaults on capitol police.  They freely told us who they were.  It is up to us to decide what to do with that information.
            </p>
            <p> In 1936, Victor Green published his "Green Book" - helping African Americans avoid racism and danger 
                in the Jim Crow south. We aim to do something similar for the modern age.</p>
            <p> It is <b>our right</b> to decide who we buy from, whose rallies we attend, and who we associate with. And it is our right to choose
                not to support businesses or politicians who fund and foment the destruction of our planet and our democracy.  The problem is that 
                there are so many people and organizations and companies using their money and power to damage the world (and hide it), that it's
                hard to keep track of them all.  
            </p>
            <p> This site helps the average person "vote with their feet" - avoid or boycott organizations that have been credibly accused or found guilty
                of heinous crimes, racism, embezzlement, or even legal but patently unethical action. <i>All blocks are publicly available for scrutiny with sources
                provided.  All blocks are optional.</i> But we think that it's worth reminding people about the Companies who launder $100M and pay $1M in fines.  
                Companies that cozy up to dicators, lie to shareholders, or swindle homeowners.  Even small businesses whose 
                owners use their profits to attend rallies, fund politicans aiming to overturn elections and suppress votes, or even buy zipties to kindap Congressmen.  
            </p>
            <h3>Do business with do-gooders. We'll help you find them.</h3> 
        </div>
    )
}
export default About