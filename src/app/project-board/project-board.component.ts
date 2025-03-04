import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { BillCardComponent } from '../bill-card/bill-card.component';
import { FirebaseService } from '../firebase.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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
    { name: 'Angular', image: 'assets/images/f.webp' },
    { name: 'Firebase', image: 'assets/images/firebase2.png' },
    { name: 'D3.js', image: 'assets/images/d3.png' },
    { name: 'React', image: 'assets/images/react.png' },
    { name: 'Vue.js', image: 'assets/images/vue.png' },
    { name: 'Svelte', image: 'assets/images/svelte.png' },
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
    if (this.project && this.project.id) {
      this.firebaseService
        .deleteProject(this.project.id)
        .then(() => {
          console.log('Project deleted successfully');
          this.projectDeleted.emit(this.project.id); // Emitir evento al padre
        })
        .catch((error: any) => {
          console.error('Error deleting project:', error);
        });
    }
  }
}
