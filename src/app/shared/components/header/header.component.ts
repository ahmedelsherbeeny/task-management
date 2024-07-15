import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService:AuthService){
    
  }

  userRole: any;

  ngOnInit(): void {
    // Get user UUID (UID) from localStorage

    
      this.getUserRole();
   
  }

  getUserRole(): void {
    const userId = localStorage.getItem('userUUID');
    if(userId){

      this.authService.getUserRole(userId).subscribe(role => {
        this.userRole = role;
        console.log(role);
        
      });
    }

  }
  logout(){

  }
}



  


