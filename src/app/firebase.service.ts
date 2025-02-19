import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore'; // Import doc, getDoc, and addDoc

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
    if (!user) {
      return []; // No hay usuario autenticado
    }

    const billsCollection = collection(this.db, `user/${user.uid}/bill`); // Path a la colección de bills del usuario
    const querySnapshot = await getDocs(billsCollection);
    const bills: any[] = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() }); // Añade el ID del documento y los datos
    });
    return bills;
  }

  // Método para obtener los datos del documento del usuario
  async getUserData(userId: string): Promise<any> {
    if (!userId) {
      return null; // No hay ID de usuario
    }
    const userDocRef = doc(this.db, `user`, userId); // Path al documento del usuario (singular 'user')
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Retorna los datos del documento
    } else {
      console.log("No such document!");
      return null; // No se encontró el documento
    }
  }

  async addProjectForCurrentUser(projectName: string, technologies: string[]): Promise<any> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in.'); // Or handle unauthenticated state appropriately
    }
  
    const projectsCollection = collection(this.db, `user/${user.uid}/project`); // Path to projects subcollection (singular 'project')
  
    return await addDoc(projectsCollection, { // Use addDoc to add a new document
      name: projectName,
      technologies: technologies,
    });
  }
}