import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => { // Define y exporta una función guardiana de rutas llamada authGuard, marcada como asíncrona (async)
  const authService = inject(AuthService); // Inyecta una instancia del servicio AuthService para gestionar la autenticación
  const router = inject(Router); // Inyecta una instancia del servicio Router para realizar la navegación

  const isAuthenticated = await authService.isAuthenticated(); // Llama al método asíncrono isAuthenticated() del AuthService y espera (await) a que la Promesa se resuelva.
  // isAuthenticated() retorna una Promesa que indica si el usuario está autenticado o no.
  // El 'await' asegura que el guard espere a que Firebase determine el estado de autenticación antes de continuar.

  console.log('authGuard - isAuthenticated (awaited):', isAuthenticated); // Imprime en la consola el valor de isAuthenticated (true o false) para depuración

  if (isAuthenticated) { // Si isAuthenticated es true (el usuario está autenticado)
    return true; // Permite la activación de la ruta. El usuario puede acceder a la ruta protegida.
  } else { // Si isAuthenticated es false (el usuario no está autenticado)
    return router.parseUrl('/login'); // Cancela la activación de la ruta actual y redirige al usuario a la ruta '/login' (página de inicio de sesión).
    // router.parseUrl('/login') crea una URL inmutable que representa la ruta '/login' para la redirección.
  }
};