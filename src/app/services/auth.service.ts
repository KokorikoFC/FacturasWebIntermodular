import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para redirigir
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { } // Inyecta Router

  isAuthenticated(): boolean {
    const auth = getAuth();
    return !!auth.currentUser; // Verifica el usuario autenticado en Firebase
  }

  checkLoginStatus(): boolean { // Método para verificar el estado y redirigir si no autenticado
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirige a login si no está autenticado
      return false; // Indica que no está autenticado
    }
    return true; // Indica que está autenticado
  }
}