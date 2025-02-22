import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Asegúrate de importar el componente
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProjectFormComponent } from './add-project-form/add-project-form.component';
import { RegisterComponent } from './register/register.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'projectManagement', component: ProjectManagementComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addProjectForm', component: AddProjectFormComponent },

];
