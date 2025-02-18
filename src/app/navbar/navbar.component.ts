import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-navbar',
  standalone: true, // Marca el componente como standalone
  imports: [RouterModule], // Importa RouterModule para usar routerLink
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}