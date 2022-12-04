import React, {useState} from 'react';
import { useTranslation } from "react-i18next"
import Modal from './Modal'
import emailjs, { init } from 'emailjs-com';

init("user_uZyENKBtU2la8xrJoPgY6");

function useInput(initialValue){
    const [value,setValue] = useState(initialValue);
 
     function handleChange(e){
         setValue(e.target.value);
     }
 
    return [value,handleChange,setValue];
 }

export default function Form(){
  const [t] = useTranslation("global")
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const toggleModal = () => {
    setOpen(!open)
    document.body.style.overflow === "hidden" ? document.body.style.overflow = "auto" : document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setOpen(false)
    document.body.style.overflow = "auto"
  }

  const [name,changeName,setName] = useInput('');
  const [surname,changeSurname,setSurname] = useInput('');
  const [email,changeEmail,setEmail] = useInput('');
  const [location,changeLocation,setLocation] = useInput('');
  const [message,changeMessage,setMessage] = useInput('');
  const [checked,setCheck] = useState(false);

  const [errorName,setErrorName] = useState(false);
  const [errorSurname,setErrorSurname] = useState(false);
  const [errorEmail,setErrorEmail] = useState(false);
  const [errorLocation,setErrorLocation] = useState(false);
  const [errorMessage,setErrorMessage] = useState(false);
  const [errorCheck,setErrorCheck] = useState(false);
  

  function validateEmail(email) {
    const re = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(String(email).toLowerCase());
  }

  function handleChangeName(e) {
    changeName(e)
    setErrorName(false)
  }
  function handleChangeSurname(e) {
    changeSurname(e)
    setErrorSurname(false)
  }
  function handleChangeEmail(e) {
    changeEmail(e)
    setErrorEmail(false)
  }
  function handleChangeLocation(e) {
    changeLocation(e)
    setErrorLocation(false)
  }
  function handleChangeMessage(e) {
    changeMessage(e)
    setErrorMessage(false)
  }

  function validateForm(name, surname, email, location, message, checked) {
    let validForm = true
    //name
    if (name === '') {
      setErrorName(true)
      validForm = false
    } else {
      setErrorName(false)
    }
    //surname
    if (surname === '') {
      setErrorSurname(true)
      validForm = false
    } else {
      setErrorSurname(false)
    }
    //email
    if(!validateEmail(email)) {
      setErrorEmail(true)
      validForm = false
    } else {
      setErrorEmail(false)
    }
    //location
    if (location === '') {
      setErrorLocation(true)
      validForm = false
    } else {
      setErrorLocation(false)
    }
    //message
    if (message === '') {
      setErrorMessage(true)
      validForm = false
    } else {
      setErrorMessage(false)
    }
    //checkbox
    if (!checked) {
      setErrorCheck(true)
      validForm = false
    } else {
      setErrorCheck(false)
    }
    return validForm
  }

  function handleSubmit(e){
    e.preventDefault() // stops default reloading behaviour
    if (validateForm(name, surname, email, location, message, checked)){
      emailjs.send("service_5jdppsk","template_ojjopdn",{
        name: name,
        surname: surname,
        email: email,
        location: location,
        message: message
      });
      setName('')
      setSurname('')
      setEmail('')
      setLocation('')
      setMessage('')
      document.getElementById('privacyCheckbox').checked = false
      setCheck(false)
      setTimeout(() => { 
        alert(t('contact-op.code200'))
      }, 500);
    } else {
      setTimeout(() => { 
        alert(t('contact-op.error'))
      }, 100);
    }
  }

    return (
      <React.Fragment>
        <form method="POST" onSubmit={handleSubmit} className="c-form">
            <input className={errorName && 'c-form--error'} placeholder={t("contact-op.name")} value={name} onChange={handleChangeName}/>
            <input className={errorSurname && 'c-form--error'} placeholder={t("contact-op.surname")} value={surname} onChange={handleChangeSurname}/>
            <input className={errorEmail && 'c-form--error'} placeholder={t("contact-op.email")} value={email} onChange={handleChangeEmail}/>
            <input className={errorLocation && 'c-form--error'}placeholder={t("contact-op.location")} value={location} onChange={handleChangeLocation}/>
            <textarea className={errorMessage && 'c-form--error'} placeholder={t("contact-op.message")} value={message} onChange={handleChangeMessage} rows="4" cols="69"/>
            <div className="c-form--checkbox">
                <input type="checkbox" id="privacyCheckbox" name="privacy" value='accept' onChange={() => {setCheck(!checked); setErrorCheck(false)}}/>
                <label for="privacy" className={errorCheck && 'c-form--error'}>
                  {t("contact-op.accept")} 
                  <span className="c-form--privacy" onClick={() => { toggleModal(); setType('privacy')}}>
                    {t("contact-op.privacy")}
                  </span>
                </label>
            </div>
            <button>{t("contact-op.submit")}</button>
        </form>
        <Modal open={open} toggleModal={() => closeModal()} type={type}/>
      </React.Fragment>
    )
}