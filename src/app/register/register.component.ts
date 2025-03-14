import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  register() {
    this.errorMessage = '';
    this.successMessage = '';
    this.firebaseService
      .registerUser(this.email, this.password)
      .then((userCredential) => {

        // Registro exitoso
        this.successMessage = 'Registro completado con éxito. ¡Bienvenido!';
        console.log('Usuario registrado:', userCredential.user);

        if (userCredential.user) {
          // Crear documento de usuario y subcolección de tecnologías
          this.firebaseService
            .createUserDocument(userCredential.user.uid, this.email, this.name)
            .then(() => {
              console.log(
                'Documento de usuario y tecnologías creadas en Firestore'
              );
              // Esperar 2 segundos antes de navegar
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            })
            .catch((error) => {
              console.error(
                'Error al crear documento de usuario en Firestore:',
                error
              );
              this.errorMessage = 'Error al crear perfil de usuario.';
            });
        } else {
          console.error('Error: userCredential.user es null');
        }
      })
      .catch((error) => {
        console.error('Error en registro:', error);
      });
  }

}
