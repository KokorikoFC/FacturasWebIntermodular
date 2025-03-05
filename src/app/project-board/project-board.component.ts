import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BillCardComponent } from '../bill-card/bill-card.component';
import { FirebaseService } from '../services/firebase.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, BillCardComponent],
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css'],
})
export class ProjectBoardComponent {
  @Input() project: any;
  @Output() projectDeleted = new EventEmitter<string>();

  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/angular.png' },
    { name: 'Bootstrap', image: 'assets/images/bootstrap.png' },
    { name: 'CSS', image: 'assets/images/css.png' },
    { name: 'D3.js', image: 'assets/images/d3.png' },
    { name: 'Firebase', image: 'assets/images/firebase2.png' },
    { name: 'HTML', image: 'assets/images/html.png' },
    { name: 'Java', image: 'assets/images/java.png' },
    { name: 'JavaScript', image: 'assets/images/javascript.png' },
    { name: 'MySQL', image: 'assets/images/mysql.png' },
    { name: 'PostgreSQL', image: 'assets/images/postgre.png' },
    { name: 'Python', image: 'assets/images/python.png' },
    { name: 'React', image: 'assets/images/react.png' },
    { name: 'Svelte', image: 'assets/images/svelte.png' },
    { name: 'TypeScript', image: 'assets/images/typescript.png' },
    { name: 'Vue.js', image: 'assets/images/vue.png' },
    { name: 'Rust', image: 'assets/images/rust.png' }
  ];

  constructor(private firebaseService: FirebaseService) {}

  onBillDroppedToProject(event: CdkDragDrop<any[]>) {
    const bill = event.previousContainer.data[event.previousIndex];
    const targetProject = this.project;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        targetProject.bills,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (!targetProject.bills) {
        targetProject.bills = [];
      }
      targetProject.bills.push(bill);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    targetProject.bills = [...targetProject.bills];
    this.firebaseService.updateBill(bill.id, { idProject: targetProject.id });

    console.log(`Bill ${bill.id} moved to project ${targetProject.id}`);
  }

  getTechnologyImage(techName: string): string {
    const tech = this.availableTechnologies.find((t) => t.name === techName);
    return tech ? tech.image : 'assets/images/default.png';
  }

  deleteProject() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#56a6e8",
      cancelButtonColor: "#e85d56",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && this.project && this.project.id) {
        this.firebaseService.deleteProject(this.project.id)
          .then(() => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "Tu proyecto ha sido eliminado.",
              icon: "success",
            });
            this.projectDeleted.emit(this.project.id);
          })
          .catch((error: any) => {
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar el proyecto.",
              icon: "error",
            });
            console.error("Error deleting project:", error);
          });
      }
    });
  }
  
  
}
