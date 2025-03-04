import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
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
    private cdRef: ChangeDetectorRef
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
        this.allBills = bills;
        this.bills = this.allBills.filter(bill => !bill.idProject);
        console.log('All Bills loaded:', this.allBills);
        console.log('Bills (without project):', this.bills);
        this.assignBillsToProjects();
      })
      .catch((error) => {
        console.error('Error loading bills:', error);
      });
  }

  loadProjects() {
    this.firebaseService.getProjectsForCurrentUser()
      .then((projects) => {
        this.projects = projects.map(project => ({ ...project, bills: [] }));
        console.log('Projects loaded:', this.projects);
        this.assignBillsToProjects();
      })
      .catch((error) => {
        console.error('Error loading projects:', error);
      });
  }

  
  assignBillsToProjects() {
    if (!this.projects || !this.allBills) {
      return;
    }
    this.projects.forEach(project => {
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

  dropBill(event: CdkDragDrop<any[]>) {
    const bill = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer !== event.container) {
      if (event.container.id === 'projectList') {
        const targetProject = this.projects.find(p => p.id === event.container.id);

        if (targetProject) {
          if (!targetProject.bills) {
            targetProject.bills = [];
          }
          targetProject.bills.push(bill);
          this.firebaseService.updateBill(bill.id, { idProject: targetProject.id });
          this.bills = this.bills.filter(b => b.id !== bill.id);
          this.bills = [...this.bills];
          console.log(`Factura ${bill.id} movida al proyecto ${targetProject.id}`);
        }
      } else {
        moveItemInArray(this.bills, event.previousIndex, event.currentIndex);
      }
    }
  }


  onBillDeleted(billId: string) {
    this.bills = this.bills.filter(bill => bill.id !== billId);
    console.log('Updated bills:', this.bills);
  }

  addProject(newProject: any) {
    this.projects = [...this.projects, newProject];
    this.closeAddProjectForm();
    console.log('Nuevo proyecto añadido:', newProject);
  }

  onProjectDeleted(projectId: string) {
    this.projects = this.projects.filter(project => project.id !== projectId);
    this.projects = [...this.projects]; // Forzar actualización de la vista
    console.log('Updated projects:', this.projects);
  }
  
}