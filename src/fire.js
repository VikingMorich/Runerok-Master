import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyB_6MWgHbhEAdSuRxj4S3yWTH4hYD8bk-Y",
    authDomain: "runerok-ecb7d.firebaseapp.com",
    databaseURL: "https://runerok-ecb7d.firebaseio.com",
    projectId: "runerok-ecb7d",
    storageBucket: "runerok-ecb7d.appspot.com",
    messagingSenderId: "111265817797",
    appId: "1:111265817797:web:d2b1821b4ed3155e543cac",
    measurementId: "G-1244TGV8ML"
}

var fire = firebase.initializeApp(firebaseConfig)
export default fire