import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User | null = null; // Variable para almacenar el usuario autenticado de Firebase (o null si no hay usuario)
  private authStateResolved: Promise<boolean>; // Promesa para rastrear cuando el estado de autenticación inicial se ha resuelto

  constructor(
    private router: Router,
    private ngZone: NgZone // Inyecta NgZone para manejar el contexto de Angular dentro de callbacks de Firebase
  ) {
    this.authStateResolved = new Promise<boolean>(resolve => { // Inicializa la promesa authStateResolved
      this.handleAuthStateChanged(resolve); // Llama a handleAuthStateChanged y le pasa la función 'resolve' de la promesa
    });
  }

  private handleAuthStateChanged(resolve: (value: boolean) => void): void { // Método privado para manejar los cambios en el estado de autenticación de Firebase
    const auth = getAuth(); // Obtiene la instancia de Firebase Auth
    onAuthStateChanged(auth, (user) => { // Observa los cambios en el estado de autenticación del usuario de Firebase
      this.ngZone.run(() => { // Ejecuta dentro de NgZone para que Angular detecte los cambios
        if (user) {
          // Usuario está logueado
          this.user = user; // Almacena el objeto de usuario en la variable 'user' del servicio
          console.log('Estado de autenticación inicial: Usuario logueado', user);
          resolve(true); // Resuelve la promesa authStateResolved con 'true' indicando que el usuario está logueado
        } else {
          // Usuario no está logueado
          this.user = null; // Establece 'user' a null indicando que no hay usuario logueado
          console.log('Estado de autenticación inicial: Usuario no logueado');
          resolve(false); // Resuelve la promesa authStateResolved con 'false' indicando que el usuario no está logueado
          // No redirige aquí, deja que el guard (authGuard) maneje la redirección
        }
      });
    }, (error) => { // Manejo de errores para onAuthStateChanged
      console.error("Error en onAuthStateChanged", error);
      resolve(false); // Resuelve la promesa authStateResolved con 'false' en caso de error
    });
  }

  logout() {
    const auth = getAuth();
    auth.signOut().then(() => {
      console.log('Usuario cerró sesión');
      this.router.navigate(['/login']); // Redirige a la página de login después de cerrar sesión
    }).catch((error) => {
      console.error('Error al cerrar sesión', error);
    });
  }


  isAuthenticated(): Promise<boolean> { // Método asíncrono para verificar si el usuario está autenticado. Retorna una Promesa que resuelve a boolean
    return this.authStateResolved; // Retorna la promesa que se resuelve cuando se determina el estado de autenticación inicial
  }


  checkLoginStatus(): boolean {
    // checkLoginStatus debería permanecer síncrono por ahora, confiando en la promesa isAuthenticated en el guard
    return !!this.user; // Chequeo síncrono basado en el estado actual del usuario. El guard manejará la verificación asíncrona principal
  }
}