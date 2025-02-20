import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddProjectFormComponent } from '../add-project-form/add-project-form.component'; 
import { BillCardComponent } from '../bill-card/bill-card.component';
import { ProjectBoardComponent } from '../project-board/project-board.component';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    AddProjectFormComponent,
    BillCardComponent,
    ProjectBoardComponent,
    DragDropModule,
  ],
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css'],
})
export class ProjectManagementComponent implements OnInit {
  bills: any[] = [];
  allBills: any[] = []; 
  projects: any[] = [];
  currentUserEmail: string | null = null;
  currentUserId: string | null = null;
  userName: string | null = null;
  isAddProjectFormVisible: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private cdRef: ChangeDetectorRef // Inyecta ChangeDetectorRef aquí
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadBills();
    this.loadProjects();
  }

  loadCurrentUser() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.currentUserEmail = user.email;
      this.currentUserId = user.uid;
      console.log('Current User Email:', this.currentUserEmail);
      console.log('Current User UID:', this.currentUserId);
      this.loadUserName();
    } else {
      this.currentUserEmail = null;
      this.currentUserId = null;
      this.userName = null;
      console.log('No current user found.');
    }
  }

  loadUserName() {
    if (this.currentUserId) {
      this.firebaseService.getUserData(this.currentUserId)
        .then((userData) => {
          if (userData && userData['name']) {
            this.userName = userData['name'];
            console.log('User Name:', this.userName);
          } else {
            this.userName = 'Name not found';
            console.log('User Name not found in document');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          this.userName = 'Error loading name';
        });
    } else {
      this.userName = 'No user ID';
    }
  }

  loadBills() {
    this.firebaseService.getBillsForCurrentUser()
      .then((bills) => {
        this.allBills = bills; // Store ALL bills in allBills array
        this.bills = this.allBills.filter(bill => !bill.idProject); // Filter for "Your Bills" list
        console.log('All Bills loaded:', this.allBills); // Log all bills
        console.log('Bills (without project):', this.bills); // Log bills without project
        this.assignBillsToProjects(); // Call assignBillsToProjects here, after bills are loaded
      })
      .catch((error) => {
        console.error('Error loading bills:', error);
      });
  }

  loadProjects() {
    this.firebaseService.getProjectsForCurrentUser()
      .then((projects) => {
        this.projects = projects.map(project => ({ ...project, bills: [] })); // Initialize project.bills to empty array
        console.log('Projects loaded:', this.projects);
        this.assignBillsToProjects(); // Call assignBillsToProjects again after projects are loaded (and bills are loaded)
      })
      .catch((error) => {
        console.error('Error loading projects:', error);
      });
  }


  assignBillsToProjects() {
    if (!this.projects || !this.allBills) {
      return; // Ensure projects and allBills are loaded before assigning
    }
    this.projects.forEach(project => {
      // Assign bills to projects based on idProject from the ALL bills list
      project.bills = this.allBills.filter(bill => bill.idProject === project.id);
    });

    console.log('Proyectos con facturas asignadas:', this.projects);
    console.log('Facturas restantes disponibles (sin proyecto):', this.bills);
  }

  openAddProjectForm() {
    this.isAddProjectFormVisible = true;
  }

  closeAddProjectForm() {
    this.isAddProjectFormVisible = false;
  }

  // Método para manejar el evento cuando un "bill" es movido dentro de la lista de bills
  dropBill(event: CdkDragDrop<any[]>) {
    const bill = event.previousContainer.data[event.previousIndex]; // Obtener la factura arrastrada
    
    if (event.previousContainer !== event.container) {
      // Si es un movimiento a un proyecto, encontrar el proyecto correspondiente
      if (event.container.id === 'projectList') {
        const targetProject = this.projects.find(p => p.id === event.container.id);
  
        if (targetProject) {
          if (!targetProject.bills) {
            targetProject.bills = [];
          }
  
          // Asignamos la factura al proyecto
          targetProject.bills.push(bill);
  
          // Actualizamos la factura con el idProject correspondiente en Firebase
          this.firebaseService.updateBill(bill.id, { idProject: targetProject.id });
  
          // Eliminar la factura de la lista de facturas disponibles
          this.bills = this.bills.filter(b => b.id !== bill.id);
  
          // Forzar la actualización de la vista
          this.bills = [...this.bills];
  
          console.log(`Factura ${bill.id} movida al proyecto ${targetProject.id}`);
        }
      } else {
        // Si es un movimiento entre facturas, simplemente actualizar la lista
        moveItemInArray(this.bills, event.previousIndex, event.currentIndex);
      }
    }
  }
  

  // Maneja el evento de eliminación de un bill
  onBillDeleted(billId: string) {
    // Eliminar el bill localmente de la lista
    this.bills = this.bills.filter(bill => bill.id !== billId);

    // Forzar la actualización de la vista (no necesario si las referencias son cambiadas)
    console.log('Updated bills:', this.bills);
  }
  
}
