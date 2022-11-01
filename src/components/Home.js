import React, { useEffect, useState } from 'react';
import GoogleBtn from '../GoogleBtn'
import Cookies from 'universal-cookie';

export default function Home() {
    let cookies = new Cookies();
    let isLogined = cookies.get('login') || false
    const [showLogo, setShowLogo] = useState(false)
    const [hideLogo, setHideLogo] = useState(false)
    useEffect(() => {
        if (isLogined) {
            window.location.href = '/room'
        }
        document.title = 'Runerok'
        window.scrollTo(0, 0)
        setTimeout(() => { 
            setShowLogo(true)
            setHideLogo(true)
            setTimeout(() => { 
                setShowLogo(false)
                setTimeout(() => { 
                    setHideLogo(false) 
                }, 300);
            }, 500);
        }, 500);
        
    }, []);
    
    return (
        <div className="c-home">
            <div className="c-home--background-container">
                <video autoPlay muted loop className="background-video">
                    <source src="/stockvideo_01055.mp4" type="video/mp4" />
                </video>
            </div>
            <img src="/runerok.png" alt="Runerok" className='fadeIn c-home--logo'/>
            <img src="/circular_runes.png" alt="Runerok" className='fadeIn c-home--runes rotate'/>
            <div className={`c-home--presentation ${showLogo ? '' : 'fadeIn'}`}>
                <GoogleBtn />
            </div>
        </div>
    );
}