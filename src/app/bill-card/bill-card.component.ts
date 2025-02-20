import { Component, Input } from '@angular/core'; // Import Input
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-card.component.html',
  styleUrl: './bill-card.component.css'
})
export class BillCardComponent {
  @Input() bill: any; // Declare bill as an Input property

  constructor() { } // Remove FirebaseService injection and ngOnInit
}