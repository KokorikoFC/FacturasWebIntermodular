import { Component, Input, Output, EventEmitter } from '@angular/core'; // Import Output and EventEmitter
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FirebaseService } from '../services/firebase.service';
import Swal from 'sweetalert2';


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
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#56a6e8",
      cancelButtonColor: "#e85d56",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && this.bill && this.bill.id) {
        this.firebaseService.deleteBill(this.bill.id)
          .then(() => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "La factura ha sido eliminada.",
              icon: "success",
            });
            // Emit the event to notify the parent component that the bill was deleted
            this.billDeleted.emit(this.bill.id);
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar la factura.",
              icon: "error",
            });
            console.error('Error deleting bill:', error);
          });
      }
    });
  }
  
}
