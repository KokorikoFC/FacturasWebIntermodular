import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';  // Asegúrate de importar tu servicio Firebase
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private firebaseService: FirebaseService) { }

  login() {
    this.firebaseService.loginUser(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario logueado', user);
      })
      .catch((error) => {
        console.error('Error al hacer login:', error.message);
      });
  }

  register() {
    this.firebaseService.registerUser(this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuario registrado', user);
      })
      .catch((error) => {
        console.error('Error al registrar:', error.message);
      });
  }
}
