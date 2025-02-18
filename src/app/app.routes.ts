import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Asegúrate de importar el componente


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Asegúrate de tener esta ruta para login
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirigir a login al inicio

];
