import { Component, OnInit } from '@angular/core';
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
    DragDropModule // Necesario para usar drag-drop
  ],
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css'],
})
export class ProjectManagementComponent implements OnInit {
  bills: any[] = []; 
  projects: any[] = []; 
  currentUserEmail: string | null = null; 
  currentUserId: string | null = null; 
  userName: string | null = null; 
  isAddProjectFormVisible: boolean = false; 

  constructor(private firebaseService: FirebaseService) {}

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
        this.bills = bills;
        console.log('Bills:', this.bills);
      })
      .catch((error) => {
        console.error('Error loading bills:', error);
      });
  }

  loadProjects() {
    this.firebaseService.getProjectsForCurrentUser()
      .then((projects) => {
        this.projects = projects;
        console.log('Projects loaded:', this.projects);
      })
      .catch((error) => {
        console.error('Error loading projects:', error);
      });
  }

  openAddProjectForm() {
    this.isAddProjectFormVisible = true;
  }

  closeAddProjectForm() {
    this.isAddProjectFormVisible = false;
  }

  // Método para manejar el evento cuando un "bill" es movido dentro de la lista de bills
  dropBill(event: CdkDragDrop<any[]>) {
    // Solo moverlo dentro de la misma lista (bills)
    if (event.previousContainer === event.container) {
      moveItemInArray(this.bills, event.previousIndex, event.currentIndex);
      console.log('Bills after move:', this.bills);
    }
  }

  // Método para manejar el evento cuando un "project" es movido dentro de la lista de projects
  dropProject(event: CdkDragDrop<any[]>) {
    // Solo moverlo dentro de la misma lista (projects)
    if (event.previousContainer === event.container) {
      moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
      console.log('Projects after move:', this.projects);
    }
  }
}
