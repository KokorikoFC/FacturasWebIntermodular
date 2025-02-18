import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Importa Firestore functions

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
  private db: any; // Firestore database

  constructor() {
    // Inicializa Firebase
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app); // Firebase Auth
    this.db = getFirestore(this.app); // Inicializa Firestore
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

  // Método para obtener los bills del usuario autenticado
  async getBillsForCurrentUser(): Promise<any[]> {
    const user: User | null = this.auth.currentUser;
    console.log('Current User:', user);
    if (!user) {
      console.log('No user logged in.');
      return [];
    }

    console.log('User UID:', user.uid);
    const billsCollection = collection(this.db, `user/${user.uid}/bill`);
    console.log('Bills Collection Path:', `user/${user.uid}/bill`);
    const querySnapshot = await getDocs(billsCollection);
    const bills: any[] = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() });
    });
    return bills;
  }
}