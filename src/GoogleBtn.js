import React, { useState } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useTranslation } from "react-i18next"
import Cookies from 'universal-cookie';
import fire from './fire'

export default function GoogleBtn (props) {
  let cookies = new Cookies();
  const CLIENT_ID = '479271330060-9gkueoldtkd68lpd5hkgl42buj3mgj0h.apps.googleusercontent.com';
  const [isLogined, setLogined] = useState(cookies.get('login') || false)
  const [t] = useTranslation("global")

  const responseGoogle = (response) => {
    if (response.googleId) {
      console.log(response)
      cookies.set('login', true, { path: '/' });
      setLogined(true)
      cookies.set('userName', response.profileObj.name, { path: '/' });
      cookies.set('img', response.profileObj.imageUrl, { path: '/' });
      window.location.href = '/room'
      addPlayerDB(response.profileObj.name, response.profileObj.imageUrl)
    }
    else {
      cookies.remove('login', { path: '/' });
    }
  }

  const logout = () => {
    setLogined(false)
    cookies.remove('login', { path: '/' });
    cookies.remove('userName', { path: '/' });
    cookies.remove('img', { path: '/' });
    removePlayerDB(cookies.get('key'))
    cookies.remove('key', { path: '/' });
    window.location.href = '/'
  }

  function addPlayerDB(name, imageUrl) {
    let ref = fire.database().ref().child('Room').child('Players')
    let key = ref.push().key
    cookies.set('key', key, { path: '/' });
    let updates = {}
    updates[key] = {
      username: name,
      imageUrl: imageUrl,
      ready: false,
      runes: 0,
      lives: 3,
      valknut: 0,
    }
    ref.update(updates)
  }

  function removePlayerDB(userKey) {
    
    let ref = fire.database().ref().child('Room').child('Players')
        let updates = {}
        updates[userKey] = null
        ref.update(updates)
  }
    return (
    <div>
      { isLogined ? 
        (props.type === 'header' ?
          <GoogleLogout
            clientId={CLIENT_ID}
            onLogoutSuccess={logout}
            render={renderProps => (
              <div className="c-header-mobile--option" onClick={logout} disabled={renderProps.disabled}>{t("header.logout")}</div>
            )}
            id="logoutButton"
          ></GoogleLogout> :
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
            render={renderProps => (
              <div onClick={logout} disabled={renderProps.disabled} className="c-gbutton__home">
              <div style={{margiRight: "10px", padding: "10px"}}><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg></div>
              {t("header.logout")}
            </div>
            )}
            id="logoutButton"
          ></GoogleLogout>)
        :
        (props.type === 'header' ?
          <GoogleLogin
          clientId={CLIENT_ID}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          render={renderProps => (
            <div className="c-header-mobile--option" onClick={renderProps.onClick} disabled={renderProps.disabled}>{t("header.login")}</div>
          )}
          cookiePolicy={'single_host_origin'}
          /> : 
          <GoogleLogin
          clientId={CLIENT_ID}
          buttonText={t("home.login")}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          render={renderProps => (
            <div onClick={renderProps.onClick} disabled={renderProps.disabled} className="c-gbutton__home">
              <div style={{margiRight: "10px", padding: "10px"}}><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg></div>
              {t("header.login")}
            </div>
          )}
          />
        )
      }
    </div>
    )
}