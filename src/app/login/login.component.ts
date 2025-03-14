import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router 
  ) { }

  login() {
    this.firebaseService.loginUser(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario logueado', user);
        this.router.navigate(['/projectManagement']);
      })
      .catch((error) => {
        console.error('Error al hacer login:', error.message);
        this.errorMessage = 'Error al iniciar sesión. Comprueba tus credenciales.';
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}