import React, {useEffect, useState} from 'react'
import { useTranslation } from "react-i18next"
import menu from '../icons/menu-white-18dp.svg'
import language from "../icons/language-white-18dp.svg"
import cross from '../icons/clear-white-18dp.svg'
import expand from "../icons/expand_more-white-18dp.svg"
import GoogleBtn from '../GoogleBtn'
import Modal from './Modal'
import Cookies from 'universal-cookie';

export default function Header() {
    let cookies = new Cookies();
    const [t, i18n] = useTranslation("global")
    const [mobileMenu, setMobileMenu] = useState(false)
    const [mobileMenuType, setMobileMenuType] = useState('')
    const [hideHeader, setHideHeader] = useState(false)
    const [fadeInHeader, setFadeInHeader] = useState(false)
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')

    const toggleModal = () => {
        setOpen(!open)
        setMobileMenu(false)
        document.body.style.overflow === "hidden" ? document.body.style.overflow = "auto" : document.body.style.overflow = "hidden"
    }

    const closeModal = () => {
        setOpen(false)
        document.body.style.overflow = "auto"
    }

    const setLanguage = (lang) => {
        i18n.changeLanguage(lang)
        cookies.set('lang', lang, { path: '/' });
        setMobileMenuType('')
        setMobileMenu(false)
    }
    
    // call this to Disable
    function disableScroll() {
        document.body.className = "overflowHidden"
    }
    
    // call this to Enable
    function enableScroll() {
        document.body.className = ""
    }

    useEffect(() => {
        setFadeInHeader(false)
        if(document.location.pathname === '/') {
            disableScroll()
            setHideHeader(true)
            setTimeout(() => { setHideHeader(false); setFadeInHeader(true); enableScroll() }, 5000);
        }
    }, []);

    return (
        <React.Fragment>
        {mobileMenu &&
        <div className="c-header-mobileWrapper">
            <div className="c-header-mobile">
                {mobileMenuType === '' ?
                <React.Fragment>
                    <div className="c-header-mobile--baseHeader">
                        <img className="c-header-mobile--icon" alt="cross-icon" src={language} onClick={() => setMobileMenuType('language')}/>
                        <img className="c-header-mobile--icon" alt="cross-icon" src={cross} onClick={() => setMobileMenu(false)}/>
                    </div>
                    <div className="c-header-mobile--option" onClick={() => {
                        toggleModal()
                        setType('history')
                    }}>{t("header.history")}</div>
                    <div className="c-header-mobile--option" onClick={() => {
                        toggleModal()
                        setType('instructions')
                    }}>{t("header.instructions")}</div>
                    <a className="c-header-mobile--option" href="/contact">{t("header.contact")}</a>
                    <GoogleBtn type = "header"/>
                </React.Fragment> 
                :
                <React.Fragment>
                    <div className="c-header-mobile--back" onClick={() => setMobileMenuType('')}>
                        <img className="c-header-mobile--icon__rotate2" alt="back-icon" src={expand}/>
                        {t("back")}
                    </div>
                </React.Fragment>
                }
                {mobileMenuType === 'language' &&
                <React.Fragment>
                    <h3 className="c-header-mobile--optionTitle centered">{t("language")}</h3>
                    <div className="c-header-mobile--option centered" onClick={() => setLanguage('cat')}>{t("languages.cat")}</div>
                    <div className="c-header-mobile--option centered" onClick={() => setLanguage('es')}>{t("languages.es")}</div>
                    <div className="c-header-mobile--option centered" onClick={() => setLanguage('en')}>{t("languages.en")}</div>
                </React.Fragment>
                }
            </div>
        </div>
        }
        <div className={`c-header ${hideHeader && 'opacity-off'} ${fadeInHeader && 'fadeIn'}`}>
            <div className="c-header-nav">
                <a href="/" className="c-header--logo">
                    <img src="/runerok-simple-white2.png" alt="Runerok" />
                </a>
            </div>
            <img className="c-header--icon" alt="menu-icon" src={menu} onClick={() => {setMobileMenu(true); setOpen(false)}}/>
        </div>
        <Modal open={open} toggleModal={() => closeModal()} type={type}/>
        </React.Fragment>
    )
}