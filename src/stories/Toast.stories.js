import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default {
  title: 'Runerok/Toast',
};

const showToast = () => {
    toast("I am Tostify", { autoClose: 5000 })
}
const showSuccessToast = () => {
    toast.success("Success Notification !")
}
const showErrorToast = () => {
    toast.error("Error Notification !");
    
}
const showWarningToast = () => {
    toast.warn("Warning Notification !");
    
}
const showInfoToast = () => {
    toast.info("Info Notification !");
    
}

export const BasicToast = () => {
    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <h1 style={{textAlign: 'center'}}><u>BASIC TOAST STATES</u></h1>
            <div style={{display: 'flex', marginBottom: '5px', alignItems: "center", padding: '10px', backgroundColor: "aquamarine", width: '100px', height: '100%'}} onClick={showToast}>
                <span>Show toast</span>
            </div>
            <div style={{display: 'flex', marginBottom: '5px', alignItems: "center", padding: '10px', backgroundColor: "aquamarine", width: '100px', height: '100%'}} onClick={showSuccessToast}>
                <span>Show success</span>
            </div>
            <div style={{display: 'flex', marginBottom: '5px', alignItems: "center", padding: '10px', backgroundColor: "aquamarine", width: '100px', height: '100%'}} onClick={showErrorToast}>
                <span>Show error</span>
            </div>
            <div style={{display: 'flex', marginBottom: '5px', alignItems: "center", padding: '10px', backgroundColor: "aquamarine", width: '100px', height: '100%'}} onClick={showWarningToast}>
                <span>Show warning</span>
            </div>
            <div style={{display: 'flex', marginBottom: '5px', alignItems: "center", padding: '10px', backgroundColor: "aquamarine", width: '100px', height: '100%'}} onClick={showInfoToast}>
                <span>Show info</span>
            </div>
            <ToastContainer />
        </div>
    )
};

