import React, { useState } from 'react';

export default function Button(props) {
    
    return (
        <div className={props.disabled ? 'c-button c-button--disabled' : 'c-button'} onClick={!props.disabled && props.func}>
            <span>{props.text}</span>
        </div>
    );
}