import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from '../services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-navbar',
  standalone: true, // Marca el componente como standalone
  imports: [RouterModule], // Importa RouterModule para usar routerLink
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService) { } // Inyecta AuthService

  logout() {
    this.authService.logout(); // Llama al método logout del AuthService
  }
}