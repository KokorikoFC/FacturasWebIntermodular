import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent,FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  bills: any[] = [];
  currentUserEmail: string | null = null; // Property to store user email
  currentUserId: string | null = null;   // Property to store user ID

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.loadCurrentUser(); // Load current user info first
    this.loadBills();
  }

  loadCurrentUser() {
    const user = this.firebaseService.getCurrentUser();
    if (user) {
      this.currentUserEmail = user.email;
      this.currentUserId = user.uid;
      console.log('DashboardComponent - Current User Email:', this.currentUserEmail);
      console.log('DashboardComponent - Current User UID:', this.currentUserId);
    } else {
      this.currentUserEmail = null;
      this.currentUserId = null;
      console.log('DashboardComponent - No current user found.');
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
}