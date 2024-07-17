import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  userRole!: string;

  ngOnInit(): void {
    // Get user UUID (UID) from localStorage

    this.getUserRole();
  }

  getUserRole(): void {
    const userId = localStorage.getItem('userUUID');
    if (userId) {
      this.authService.getUserRole(userId).subscribe((role) => {
        this.userRole = role!;
      });
    }
  }
  onLogout() {
    localStorage.removeItem('userUUID');
    localStorage.removeItem('userRole');

    this.router.navigate(['/auth/login']);
  }
}
