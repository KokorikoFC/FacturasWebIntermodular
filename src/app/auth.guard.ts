import { inject } from '@angular/core'; // Importa 'inject'
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Importa AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta AuthService
  const router = inject(Router); // Inyecta Router

  if (authService.isAuthenticated()) { // Utiliza AuthService para verificar autenticación
    return true; // Permite el acceso si está autenticado
  } else {
    // Redirige a la página de login si no está autenticado
    return router.parseUrl('/login'); // Redirige a '/login'
  }
};