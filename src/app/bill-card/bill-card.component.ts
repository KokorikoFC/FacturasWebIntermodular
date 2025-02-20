import { Component, Input, Output, EventEmitter } from '@angular/core'; // Import Output and EventEmitter
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-bill-card',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.css']
})
export class BillCardComponent {
  @Input() bill: any; // Declare bill as an Input property
  @Output() billDeleted = new EventEmitter<string>(); // Declare billDeleted event to notify parent

  constructor(private firebaseService: FirebaseService) {}

  ngOnDestroy() {
    console.log('Bill card destroyed');
  }

  deleteBill() {
    if (this.bill && this.bill.id) {
      this.firebaseService.deleteBill(this.bill.id)
        .then(() => {
          console.log('Bill deleted successfully');
          
          // Emit the event to notify the parent component that the bill was deleted
          this.billDeleted.emit(this.bill.id);
        })
        .catch((error) => {
          console.error('Error deleting bill:', error);
        });
    }}
}
