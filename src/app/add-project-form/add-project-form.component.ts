import { Component } from '@angular/core';
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
  projectName: string = '';
  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/angular-logo.png' },
    { name: 'Firebase', image: 'assets/images/firebase-logo.png' },
    { name: 'D3.js', image: 'assets/images/d3js-logo.png' },
    { name: 'React', image: 'assets/images/react-logo.png' },
    { name: 'Vue.js', image: 'assets/images/vuejs-logo.png' }
  ];
  selectedTechnologies: string[] = []; // <-- CORRECTED: Initialized as empty string array
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) { }

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
    .then(() => {
      this.successMessage = 'Project saved successfully!';
      this.errorMessage = '';
      this.projectName = '';
      this.selectedTechnologies = []; // <-- CORRECTED: Reset to empty array
      // Optionally, redirect to project list or dashboard after successful save
      // this.router.navigate(['/projectManagement']);
    })
    .catch(error => {
      console.error('Error saving project:', error);
      this.errorMessage = 'Error saving project. Please try again.';
      this.successMessage = '';
    });
  }
}