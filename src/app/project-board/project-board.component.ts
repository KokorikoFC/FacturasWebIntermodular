import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';  // Importar DragDropModule

import { BillCardComponent } from '../bill-card/bill-card.component'; // Importar BillCardComponent

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, BillCardComponent],
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent {
  @Input() project: any;  // Declarar el proyecto como propiedad de entrada

  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/f.webp' },
    { name: 'Firebase', image: 'assets/images/f.webp' },
    { name: 'D3.js', image: 'assets/images/f.webp' },
    { name: 'React', image: 'assets/images/firebase2.png' },
    { name: 'Vue.js', image: 'assets/images/firebase2.png' }
  ];

  constructor() { }

  // Método para manejar cuando un bill es soltado en el proyecto
  onBillDropped(event: any) {
    const bill = event.item.data;  // Obtener el bill arrastrado
    console.log('Bill dropped into project:', bill);

    // Asegurarse de que el proyecto tenga la propiedad bills
    if (!this.project.bills) {
      this.project.bills = [];  // Si no existe, inicializar el array
    }

    // Agregar el bill al proyecto
    this.project.bills.push(bill);

    // Forzar a Angular a detectar cambios si es necesario
    // Esta línea es importante si estás trabajando con una referencia de objeto inmutable
    this.project = { ...this.project };  // Crear una nueva referencia para forzar la actualización
  }
}
