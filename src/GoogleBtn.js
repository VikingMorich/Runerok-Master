import React, { useState } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { useTranslation } from "react-i18next"
import Cookies from 'universal-cookie';
import fire from './fire'

const GoogleBtn = (props)  => {
  let cookies = new Cookies();
  const CLIENT_ID = '479271330060-9gkueoldtkd68lpd5hkgl42buj3mgj0h.apps.googleusercontent.com';
  const [isLogined, setLogined] = useState(cookies.get('login') || false)
  const [t] = useTranslation("global")

  const responseGoogle=(response) =>{
    console.log(response)
    cookies.set('login', true, { path: '/' });
    setLogined(true)
    cookies.set('userName', response.profileObj.name, { path: '/' });
    cookies.set('img', response.profileObj.imageUrl, { path: '/' });
    window.location.href = '/room'
    addPlayerDB(response.profileObj.name, response.profileObj.imageUrl)
  }

  const logout=()=>{
    setLogined(false)
    removePlayerDB(cookies.get('key'))
    cookies.remove('login', { path: '/' });
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
      ready: false
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
              <div className="c-header-mobile--option" onClick={renderProps.onClick} disabled={renderProps.disabled}>{t("header.logout")}</div>
            )}
            id="logoutButton"
          ></GoogleLogout> :
          <GoogleLogout
            clientId={CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
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
          />
        )
      }
    </div>
    )
}

export default GoogleBtn;