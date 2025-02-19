import { Component, Input } from '@angular/core'; // Import Input
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule], // Import CommonModule if you need directives like *ngIf, *ngFor in the template
  templateUrl: './project-board.component.html',
  styleUrl: './project-board.component.css'
})
export class ProjectBoardComponent {
  @Input() project: any; // Declare project as an Input property

  availableTechnologies = [
    { name: 'Angular', image: 'assets/images/f.webp' }, // Correct path
    { name: 'Firebase', image: 'assets/images/f.webp' },
    { name: 'D3.js', image: 'assets/images/f.webp' },     // Correct path (assuming you have d3js-logo.png)
    { name: 'React', image: 'assets/images/firebase2.png' },     // Correct path (assuming you have react-logo.png)
    { name: 'Vue.js', image: 'assets/images/firebase2.png' }      // Correct path (assuming you have vuejs-logo.png)
  ];
  
  constructor() { } // Keep constructor empty - no data fetching here
}