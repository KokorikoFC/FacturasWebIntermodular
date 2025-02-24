
import { Component,OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';


@Component({
  selector: 'app-professional-itineraries',
  imports: [],
  templateUrl: './professional-itineraries.component.html',
  styleUrl: './professional-itineraries.component.css'
})
export class ProfessionalItinerariesComponent implements OnInit{

  itineraries:any[] = [];

  constructor(
      private firebaseService: FirebaseService,
    ) {}
  ngOnInit(): void {
    this.loadItineraries();
  }


  loadItineraries() {
    this.firebaseService.getAllItineraries()
    .then((itineraries) => {
      this.itineraries = itineraries.map(itineraries => ({ ...itineraries })); // Initialize project.bills to empty array
      console.log('Projects loaded:', this.itineraries);
      
    })
    .catch((error) => {
      console.error('Error loading projects:', error);
    });
  }
}
