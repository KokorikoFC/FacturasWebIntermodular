import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  writeBatch,
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseConfig = {
    apiKey: 'AIzaSyBMHiU6y_Eq5LZHwdQabnW3H-lFSJ1_N9M',
    authDomain: 'apptrabajadoresautonomos.firebaseapp.com',
    projectId: 'apptrabajadoresautonomos',
    storageBucket: 'apptrabajadoresautonomos.firebasestorage.app',
    messagingSenderId: '159659703361',
    appId: '1:159659703361:web:f5e9f05d48669b7b389ac0',
  };

  private app: any;
  private auth: any;
  private db: any;

  constructor() {
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async createUserDocument(userId: string, email: string) {
    const userDocRef = doc(this.db, `user/${userId}`);

    // Crear documento principal del usuario con su email
    await setDoc(userDocRef, { email: email });

    // Crear la subcolección userTechnologies con las tecnologías iniciales
    await this.createUserTechnologiesCollection(userId);
  }

  private async createUserTechnologiesCollection(userId: string) {
    const technologies = [
      'Angular',
      'CSS',
      'Docker',
      'Express',
      'Firebase',
      'Git',
      'HTML',
      'JavaScript',
      'MongoDB',
      'Node',
      'React',
      'SQL',
      'Vue',
    ];

    const batch = writeBatch(this.db);
    const userTechnologiesCollectionRef = collection(
      this.db,
      `user/${userId}/userTechnologies`
    );

    technologies.forEach((tech) => {
      const techDocRef = doc(userTechnologiesCollectionRef, tech);

      // Guardar cada tecnología con nivel inicial 0
      batch.set(techDocRef, { name: tech, level: 0 });
    });

    await batch.commit();
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  logoutUser() {
    return this.auth.signOut();
  }

  async getUserData(userId: string): Promise<any> {
    if (!userId) {
      return null;
    }
    const userDocRef = doc(this.db, `user`, userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  }

  async addProjectForCurrentUser(
    projectName: string,
    technologies: string[]
  ): Promise<any> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in.');
    }

    const projectsCollection = collection(this.db, `user/${user.uid}/project`);

    const docRef = await addDoc(projectsCollection, {
      name: projectName,
      technologies: technologies,
    });

    const newProject = await this.getProjectById(docRef.id);

    return newProject;
  }

  async getProjectById(projectId: string): Promise<any> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const projectDocRef = doc(this.db, `user/${user.uid}/project`, projectId);
    const projectSnapshot = await getDoc(projectDocRef);

    if (projectSnapshot.exists()) {
      return { id: projectSnapshot.id, ...projectSnapshot.data() };
    } else {
      throw new Error('Project not found');
    }
  }

  async getBillsForCurrentUser(): Promise<any[]> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      return [];
    }

    const billsCollection = collection(this.db, `user/${user.uid}/bill`);
    const querySnapshot = await getDocs(billsCollection);
    const bills: any[] = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() });
    });
    return bills;
  }

  async updateBill(billId: string, data: any): Promise<void> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      return Promise.reject('No user logged in');
    }

    const billDocRef = doc(this.db, `user/${user.uid}/bill`, billId);

    return updateDoc(billDocRef, data);
  }

  async deleteBill(billId: string): Promise<void> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      return Promise.reject('No user logged in');
    }

    const billDocRef = doc(this.db, `user/${user.uid}/bill`, billId);

    return deleteDoc(billDocRef);
  }

  // Method to delete a project
  async deleteProject(projectId: string): Promise<void> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      return Promise.reject('No user logged in');
    }

    const batch = writeBatch(this.db);

    // Obtener todas las bills asociadas a ese proyecto
    const billsCollection = collection(this.db, `user/${user.uid}/bill`);
    const billsQuery = query(
      billsCollection,
      where('idProject', '==', projectId)
    );
    const billsSnapshot = await getDocs(billsQuery);

    billsSnapshot.forEach((billDoc) => {
      const billRef = doc(this.db, `user/${user.uid}/bill`, billDoc.id);
      batch.update(billRef, { idProject: '' }); // Desvincular la bill del proyecto
    });

    // Eliminar el proyecto
    const projectDocRef = doc(this.db, `user/${user.uid}/project`, projectId);
    batch.delete(projectDocRef);

    await batch.commit();
    console.log(`Project ${projectId} deleted, and associated bills detached`);
  }

  async getProjectsForCurrentUser(): Promise<any[]> {
    const user: User | null = this.auth.currentUser;
    if (!user) {
      return [];
    }

    const projectCollection = collection(this.db, `user/${user.uid}/project`);
    const querySnapshot = await getDocs(projectCollection);
    const projects: any[] = [];
    querySnapshot.forEach((doc) => {
      console.log('Project doc data:', doc.data());
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  }

  //--------------------INTINERARIOS PROFESIONALES--------------------

  async getAllItineraries(): Promise<any[]> {
    const itineraries: any[] = [];
    const itinerariesRef = collection(this.db, 'professional_itineraries');
    const itinerariesSnapshot = await getDocs(itinerariesRef);

    for (const itineraryDoc of itinerariesSnapshot.docs) {
      const itineraryId = itineraryDoc.id;
      const itineraryData = itineraryDoc.data();

      const techRef = collection(
        this.db,
        'professional_itineraries',
        itineraryId,
        'technologies'
      );
      const techSnapshot = await getDocs(techRef);

      const technologies = techSnapshot.docs.map((techDoc) => ({
        id: techDoc.id,
        ...techDoc.data(),
      }));

      itineraries.push({
        id: itineraryId,
        ...itineraryData,
        technologies: technologies,
      });
    }
    return itineraries;
  }

  async getUserTechnologies(userId: string): Promise<any[]> {
    const user = this.auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error('No user logged in or invalid user ID');
    }

    const technologiesCollectionRef = collection(
      this.db,
      `user/${userId}/userTechnologies`
    );
    const technologiesSnapshot = await getDocs(technologiesCollectionRef);

    const technologies: any[] = [];
    technologiesSnapshot.forEach((techDoc) => {
      technologies.push({
        id: techDoc.id,
        ...techDoc.data(),
      });
    });

    return technologies;
  }

  async updateUserTechnologies(
    userId: string,
    technologies: any[]
  ): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error('No user logged in or invalid user ID');
    }

    const batch = writeBatch(this.db);
    const technologiesCollectionRef = collection(
      this.db,
      `user/${userId}/userTechnologies`
    );

    technologies.forEach((tech) => {
      const { id, ...techWithoutId } = tech;

      const techDocRef = doc(
        this.db,
        `user/${userId}/userTechnologies/${tech.id}`
      );
      batch.set(techDocRef, techWithoutId);
    });

    await batch.commit();
  }
}
