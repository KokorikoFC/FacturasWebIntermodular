import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddProjectFormComponent } from '../add-project-form/add-project-form.component'; // Import AddProjectFormComponent

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, RouterModule, AddProjectFormComponent], // Import and add AddProjectFormComponent to imports
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.css'
})
export class ProjectManagementComponent implements OnInit {
  bills: any[] = [];
  currentUserEmail: string | null = null;
  currentUserId: string | null = null;
  userName: string | null = null;
  isAddProjectFormVisible: boolean = false; // Flag to control modal visibility


  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadBills();
  }

  loadCurrentUser() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.currentUserEmail = user.email;
      this.currentUserId = user.uid;
      console.log('DashboardComponent - Current User Email:', this.currentUserEmail);
      console.log('DashboardComponent - Current User UID:', this.currentUserId);
      this.loadUserName();
    } else {
      this.currentUserEmail = null;
      this.currentUserId = null;
      this.userName = null;
      console.log('DashboardComponent - No current user found.');
    }
  }

  loadUserName() {
    if (this.currentUserId) {
      this.firebaseService.getUserData(this.currentUserId)
        .then(userData => {
          if (userData && userData['name']) {
            this.userName = userData['name'];
            console.log('DashboardComponent - User Name:', this.userName);
          } else {
            this.userName = 'Name not found';
            console.log('DashboardComponent - User Name not found in document');
          }
        })
        .catch(error => {
          console.error('DashboardComponent - Error fetching user data:', error);
          this.userName = 'Error loading name';
        });
    } else {
      this.userName = 'No user ID';
    }
  }

  loadBills() {
    this.firebaseService.getBillsForCurrentUser()
      .then(bills => {
        this.bills = bills;
        console.log('Bills del usuario en DashboardComponent:', this.bills);
      })
      .catch(error => {
        console.error('Error al obtener los bills:', error);
      });
  }

  openAddProjectForm() {
    this.isAddProjectFormVisible = true; // Show the modal
  }

  closeAddProjectForm() {
    this.isAddProjectFormVisible = false; // Hide the modal
  }
}