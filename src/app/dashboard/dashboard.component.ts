import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'; // Importa NavbarComponent
import { CommonModule } from '@angular/common'; // Importa CommonModule si aún no lo tienes

@Component({
  selector: 'app-dashboard',
  standalone: true, // Asegúrate de que DashboardComponent también sea standalone (si quieres que lo sea)
  imports: [NavbarComponent, CommonModule], // Importa NavbarComponent aquí y CommonModule si lo necesitas
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}