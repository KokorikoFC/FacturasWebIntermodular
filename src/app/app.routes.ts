import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Asegúrate de importar el componente
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // Asegúrate de tener esta ruta para login
  { path: 'navbar', component: NavbarComponent }, 
  {path: 'projectManagement', component:ProjectManagementComponent },
  { path: 'dashboard', component: DashboardComponent }, 

];
