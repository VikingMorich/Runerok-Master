import React, {useEffect, useState} from 'react'
import { useTranslation } from "react-i18next"
import menu from '../icons/menu-white-18dp.svg'
import language from "../icons/language-white-18dp.svg"
import blackcross from '../icons/clear-black-18dp.svg'
import cross from '../icons/clear-white-18dp.svg'
import expand from "../icons/expand_more-white-18dp.svg"
import GoogleBtn from '../GoogleBtn'
import Modal from './Modal'
import Button from './Button'
import {changeImgAvatar, changeUsername} from './GameFunctions'
import Cookies from 'universal-cookie';

function useInput(initialValue){
    const [value,setValue] = useState(initialValue);
    function handleChange(e){
        setValue(e.target.value);
    }
    return [value,handleChange,setValue];
 }

export default function Header() {
    let cookies = new Cookies();
    const [t, i18n] = useTranslation("global")
    const [mobileMenu, setMobileMenu] = useState(false)
    const [mobileMenuType, setMobileMenuType] = useState('')
    const [hideHeader, setHideHeader] = useState(false)
    const [fadeInHeader, setFadeInHeader] = useState(false)
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')
    const [configType, setConfigType] = useState('')
    const [avatarImg, setAvatarImg] = useState(cookies.get('img'))
    const [nickname,changeNickname,setNickname] = useInput('');
    const avatar1 = './avatar/avatar6.jpg';
    const avatar2 = './avatar/avatar2.jpg';
    const avatar3 = './avatar/avatar3.jpg';
    const avatar4 = './avatar/avatar4.jpg';
    const avatar5 = './avatar/avatar5.jpg';
    const avatar6 = './avatar/avatar1.jpg';
    const avatar7 = './avatar/avatar7.jpg';
    const avatar8 = './avatar/avatar8.jpg';

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

    function handleSubmit(e){
        e.preventDefault()
        changeUsername(nickname)
        cookies.set('userName', nickname, { path: '/' });
        setNickname('')
        setConfigType('')
    }

    function changeAvatar () {
        changeImgAvatar(avatarImg)
        setConfigType('')
        setAvatarImg(cookies.get('img'))
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
                    {cookies.get('login') &&
                        <div className="c-header-mobile--option" onClick={() => {setMobileMenuType('configuration')}}>{t("header.profile")}</div>
                    }
                    <div className="c-header-mobile--option" onClick={() => {
                        toggleModal()
                        setType('instructions')
                    }}>{t("header.instructions")}</div>
                    <a className="c-header-mobile--option" href="/contact">{t("header.contact")}</a>
                    <GoogleBtn type = "header"/>
                </React.Fragment> 
                :
                <React.Fragment>
                    <div className="c-header-mobile--back" onClick={() => {setMobileMenuType(''); setConfigType('')}}>
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
                {mobileMenuType === 'configuration' &&
                <React.Fragment>
                    <h3 className="c-header-mobile--optionTitle centered">{t("header.profile")}</h3>
                    <div className="c-header-mobile--option centered" onClick={() => setConfigType('nickname')}>{t("header.nickname")}</div>
                    <div className="c-header-mobile--option centered" onClick={() => setConfigType('avatar')}>{t("header.avatar")}</div>
                </React.Fragment>
                }
            </div>
        </div>
        }
        {configType === 'nickname' &&
        <div className="c-config__nickname-modal">
            <img className="c-modal--cross" alt="menu-icon" src={blackcross} onClick={() => setConfigType('')}/>
            <h3 className="c-config__nickname-modal--title">{t('header.nicknameTitle').toUpperCase()}</h3>
            <form method="POST" onSubmit={handleSubmit} className="c-config__nickname-modal--form">
                <input placeholder={t("header.nick")} value={nickname} onChange={changeNickname} className="c-config__nickname-modal--input"/>
            </form>
            <br />
            <button className="send-button" onClick={handleSubmit}>{t("header.confirm")}</button>
        </div>
        }
        {configType === 'avatar' &&
        <div className="c-config__avatar-modal">
            <img className="c-modal--cross" alt="menu-icon" src={blackcross} onClick={() => setConfigType('')}/>
            <h2 className="c-config__avatar-modal--title">{t('header.avatarTitle').toUpperCase()}</h2>
            <div className="c-config__avatar-box" id="avatar-selector">
                <img className={`c-config__avatar-img ${avatarImg === cookies.get('img') && 'c-config__avatar-img--selected'}`} alt="avatar0" src={cookies.get('img')} onClick={() => setAvatarImg(cookies.get('img'))}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar1 && 'c-config__avatar-img--selected'}`} alt="avatar1" src={avatar1} onClick={() => setAvatarImg(avatar1)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar2 && 'c-config__avatar-img--selected'}`} alt="avatar2" src={avatar2} onClick={() => setAvatarImg(avatar2)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar3 && 'c-config__avatar-img--selected'}`} alt="avatar3" src={avatar3} onClick={() => setAvatarImg(avatar3)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar4 && 'c-config__avatar-img--selected'}`} alt="avatar4" src={avatar4} onClick={() => setAvatarImg(avatar4)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar5 && 'c-config__avatar-img--selected'}`} alt="avatar5" src={avatar5} onClick={() => setAvatarImg(avatar5)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar6 && 'c-config__avatar-img--selected'}`} alt="avatar6" src={avatar6} onClick={() => setAvatarImg(avatar6)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar7 && 'c-config__avatar-img--selected'}`} alt="avatar7" src={avatar7} onClick={() => setAvatarImg(avatar7)}/>
                <img className={`c-config__avatar-img ${avatarImg === avatar8 && 'c-config__avatar-img--selected'}`} alt="avatar8" src={avatar8} onClick={() => setAvatarImg(avatar8)}/>
            </div>
            <Button text={t("header.confirm")} func={() => changeAvatar()}/>
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