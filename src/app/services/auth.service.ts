import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User | null = null; 
  private authStateResolved: Promise<boolean>; 

  constructor(
    private router: Router,
    private ngZone: NgZone 
  ) {
    this.authStateResolved = new Promise<boolean>(resolve => { 
      this.handleAuthStateChanged(resolve); 
    });
  }

  private handleAuthStateChanged(resolve: (value: boolean) => void): void { 
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => { 
      this.ngZone.run(() => { 
        if (user) {
          // Usuario está logueado
          this.user = user; 
          console.log('Estado de autenticación inicial: Usuario logueado', user);
          resolve(true); 
        } else {
          // Usuario no está logueado
          this.user = null; 
          console.log('Estado de autenticación inicial: Usuario no logueado');
          resolve(false); 
        }
      });
    }, (error) => { 
      console.error("Error en onAuthStateChanged", error);
      resolve(false); 
    });
  }

  logout() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('Usuario cerró sesión');
      this.router.navigate(['/login']); 
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);
    });
  }


  isAuthenticated(): Promise<boolean> { 
    return this.authStateResolved; 
  }


  checkLoginStatus(): boolean {
    return !!this.user; 
  }
}