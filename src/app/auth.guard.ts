import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => { 
  const authService = inject(AuthService); 
  const router = inject(Router); 

  const isAuthenticated = await authService.isAuthenticated(); 

  console.log('authGuard - isAuthenticated (awaited):', isAuthenticated);

  if (isAuthenticated) { 
    return true; 
  } else { 
    return router.parseUrl('/login');
  }
};