import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
 

  userRole!: string;
  private subscriptions: Subscription[] = [];


  ngOnInit(): void {
    // Get user UUID (UID) from localStorage

    this.getUserRole();
  }

  getUserRole(): void {
    const userId = localStorage.getItem('userUUID');
    if (userId) {
      const headerSubscription=this.authService.getUserRole(userId).subscribe((role) => {
        this.userRole = role!;
      });
      this.subscriptions.push(headerSubscription);

    }
  }
  onLogout() {
    localStorage.removeItem('userUUID');
    localStorage.removeItem('userRole');

    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions


 }
}
