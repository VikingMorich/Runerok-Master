import React from 'react';
import expand from "../icons/expand_more-white-18dp.svg"

export default function Arrow() {
    
    return (
        <div className='c-arrow' onClick={() => {window.scrollTo(0, 0)}}>
            <img alt="expand-icon" src={expand}/>
        </div>
    );
}