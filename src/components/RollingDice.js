import React from 'react';

export default function RollingDice(props) {
    
    return (
        <ol className={`die-list ${props.even ? 'odd-roll' : 'even-roll'}`}>
            <li className={`die-item die--${props.color} data-side-1`}></li>
            <li className={`die-item die--${props.color} data-side-2`}></li>
            <li className={`die-item die--${props.color} data-side-3`}></li>
            <li className={`die-item die--${props.color} data-side-4`}></li>
            <li className={`die-item die--${props.color} data-side-5`}></li>
            <li className={`die-item die--${props.color} data-side-6`}></li>
        </ol>
    );
}