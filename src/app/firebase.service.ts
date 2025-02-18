import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: "AIzaSyBMHiU6y_Eq5LZHwdQabnW3H-lFSJ1_N9M",
    authDomain: "apptrabajadoresautonomos.firebaseapp.com",
    projectId: "apptrabajadoresautonomos",
    storageBucket: "apptrabajadoresautonomos.firebasestorage.app",
    messagingSenderId: "159659703361",
    appId: "1:159659703361:web:f5e9f05d48669b7b389ac0"
  };

  private app: any;
  private auth: any;

  constructor() {
    // Inicializa Firebase
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app); // Firebase Auth
  }

  // Método para registrar un nuevo usuario
  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Método para hacer login
  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Método para cerrar sesión
  logoutUser() {
    return this.auth.signOut();
  }
}
