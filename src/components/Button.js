import React, { useState } from 'react';

export default function Button(props) {
    
    return (
        <div className="c-button" onClick={props.func}>
            <span>{props.text}</span>
        </div>
    );
}