import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'; // Si quieres usar autenticación
import { getFirestore } from 'firebase/firestore'; // Si usas Firestore

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_ID_DEL_PROYECTO.firebaseapp.com",
    projectId: "TU_ID_DEL_PROYECTO",
    storageBucket: "TU_ID_DEL_PROYECTO.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  };

  private app: any;

  constructor() {
    // Inicializa Firebase
    this.app = initializeApp(this.firebaseConfig);
    getAnalytics(this.app); // Si usas Analytics
    getAuth(this.app); // Si usas Autenticación
    getFirestore(this.app); // Si usas Firestore
  }

  // Aquí puedes añadir métodos para interactuar con Firebase, como login, registro, etc.
}
