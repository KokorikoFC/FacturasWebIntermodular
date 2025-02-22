import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

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
    this.firebaseService.registerUser(this.email, this.password)
      .then((userCredential) => {
        // Registro exitoso
        this.successMessage = 'Registro completado con éxito. ¡Bienvenido!';
        console.log('Usuario registrado:', userCredential.user);

        // Crear documento de usuario en Firestore
        if (userCredential.user) { // Verifica que userCredential.user no sea null
          this.firebaseService.createUserDocument(userCredential.user.uid, {
            email: this.email, // Guarda el email en el documento
            // Puedes añadir más información del usuario aquí si es necesario
          }).then(() => {
            console.log('Documento de usuario creado en Firestore');
            this.router.navigate(['/login']);
          }).catch((error) => {
            console.error('Error al crear documento de usuario en Firestore:', error);
            this.errorMessage = 'Error al crear perfil de usuario.'; // Mensaje de error genérico
          });
        } else {
          console.error('Error: userCredential.user es null');
          this.errorMessage = 'Error al obtener información del usuario tras registro.';
        }
      })
      .catch((error) => {
        // Error en el registro
        this.errorMessage = this.getErrorMessage(error.code);
        console.error('Error en registro:', error);
      });
  }

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email ya está en uso.';
      case 'auth/invalid-email':
        return 'Email no válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'Registro con email/contraseña no habilitado.';
      default:
        return 'Error desconocido al registrarse.';
    }
  }
}