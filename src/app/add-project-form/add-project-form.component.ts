import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-project-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.css'
})
export class AddProjectFormComponent {
  @Output() projectAdded = new EventEmitter<any>(); // Emitir cuando se agregue un proyecto

  projectName: string = '';
  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/f.webp' },
    { name: 'Firebase', image: 'assets/images/f.webp' },
    { name: 'D3.js', image: 'assets/images/f.webp' },
    { name: 'React', image: 'assets/images/firebase2.png' },
    { name: 'Vue.js', image: 'assets/images/firebase2.png' }
  ];

  selectedTechnologies: string[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  toggleTechnology(techName: string) {
    const index = this.selectedTechnologies.indexOf(techName);
    if (index > -1) {
      this.selectedTechnologies.splice(index, 1);
    } else {
      this.selectedTechnologies.push(techName);
    }
  }

  isSelected(techName: string): boolean {
    return this.selectedTechnologies.includes(techName);
  }

  onSubmit() {
    if (!this.projectName) {
      this.errorMessage = 'Project name is required.';
      this.successMessage = '';
      return;
    }
  
    if (this.selectedTechnologies.length === 0) {
      this.errorMessage = 'Please select at least one technology.';
      this.successMessage = '';
      return;
    }
  
    this.errorMessage = '';
    this.successMessage = 'Saving project...';
  
    this.firebaseService.addProjectForCurrentUser(this.projectName, this.selectedTechnologies)
      .then((newProject) => {
        this.successMessage = 'Project saved successfully!';
        this.errorMessage = '';
        this.projectName = '';
        this.selectedTechnologies = [];
  
        // 🔥 Emitir el proyecto completo para que aparezca en la lista al instante
        this.projectAdded.emit(newProject); 
      })
      .catch((error) => {
        console.error('Error saving project:', error);
        this.errorMessage = 'Error saving project. Please try again.';
        this.successMessage = '';
      });
  }
  
}
