import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router // Inyecta Router en el constructor
  ) { }

  login() {
    this.firebaseService.loginUser(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario logueado', user);
        // Redirige al dashboard tras login exitoso
        this.router.navigate(['/projectManagement']);
      })
      .catch((error) => {
        console.error('Error al hacer login:', error.message);
        // Aquí puedes añadir código para mostrar un mensaje de error al usuario
      });
  }

  register() {
    this.firebaseService.registerUser(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario registrado', user);
        // Redirige al dashboard tras registro exitoso (opcional, si quieres)
        // this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        console.error('Error al registrar:', error.message);
      });
  }
}