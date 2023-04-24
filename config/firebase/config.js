// Firebase config key setup

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";

const firebaseConfig = {
	apiKey: "AIzaSyCbPC8Gz56wyeYvV5ObzN0G_KfvLVdL8c8",
	authDomain: "recipdo-710f8.firebaseapp.com",
	projectId: "recipdo-710f8",
	storageBucket: "recipdo-710f8.appspot.com",
	messagingSenderId: "532163312970",
	appId: "1:532163312970:web:6a0e5c3ed6da0255a795b3",
	measurementId: "G-YWP8CDTHFW",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
export const functions = firebase.functions();
export default firebase;
