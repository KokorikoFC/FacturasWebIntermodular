import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FacturasWebIntermodular';
  constructor(private firebaseService: FirebaseService) {
    // Aquí ya tienes acceso a Firebase a través del servicio
    console.log('Firebase está inicializado');
  }
}
