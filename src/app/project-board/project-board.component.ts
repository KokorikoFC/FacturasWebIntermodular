import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop'; // Importar DragDropModule
import { BillCardComponent } from '../bill-card/bill-card.component'; // Importar BillCardComponent
import { FirebaseService } from '../firebase.service'; // Importar FirebaseService
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, BillCardComponent],
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css'],
})
export class ProjectBoardComponent {
  @Input() project: any; // Declarar el proyecto como propiedad de entrada

  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/f.webp' },
    { name: 'Firebase', image: 'assets/images/f.webp' },
    { name: 'D3.js', image: 'assets/images/f.webp' },
    { name: 'React', image: 'assets/images/firebase2.png' },
    { name: 'Vue.js', image: 'assets/images/firebase2.png' },
  ];

  constructor(private firebaseService: FirebaseService) {}

  // Método para manejar cuando un bill es soltado en el proyecto
  onBillDroppedToProject(event: CdkDragDrop<any[]>) {
    const bill = event.previousContainer.data[event.previousIndex]; // Obtener la factura arrastrada
    const targetProject = this.project; // Proyecto al que se está arrastrando la factura

    // Si el contenedor de destino es el mismo (es decir, reordenar dentro del mismo proyecto)
    if (event.previousContainer === event.container) {
      // Solo mover los elementos en el arreglo
      moveItemInArray(
        targetProject.bills,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Si se está moviendo el bill de un proyecto a otro
      if (!targetProject.bills) {
        targetProject.bills = [];
      }
      targetProject.bills.push(bill);

      // Eliminar la factura de la lista original de bills
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    // Forzar una actualización creando una nueva referencia del arreglo de bills
    targetProject.bills = [...targetProject.bills];

    // Actualizar el campo 'idProject' del bill en Firebase
    this.firebaseService.updateBill(bill.id, { idProject: targetProject.id });

    console.log(`Bill ${bill.id} moved to project ${targetProject.id}`);
  }

  getTechnologyImage(techName: string): string {
    const tech = this.availableTechnologies.find((t) => t.name === techName);
    return tech ? tech.image : 'assets/images/default.png'; // Imagen por defecto si no la encuentra
  }
  
  
}
