import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ManagerService } from 'src/app/manager/manager.service';
import { User } from 'src/app/shared/models/user/user';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  users: User[] = [];
  userRole: string | null = null; // Current user role
  roleOptions: string[] = ['user', 'manager']; // Role options for editing
  managableUsers: User[] = [];

  constructor(
    private userService: UserService,
    private managerService: ManagerService // private toastr: ToastrService // Optional: Toastr for notifications
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.getUsersAndManager()
    this.loadManagableUsers();

  }

  getUsersAndManager(){
    this.userService.getUsers().subscribe(us=>{
      this.users = us.filter(
        (user) =>
          user.role !== 'admin'
      );

    })
  }

  loadManagableUsers() {
    this.userService.getUsers().subscribe((users:User[]) => {
      // Filter out users with role 'admin'
      this.managableUsers = users.filter(
        (user:User) =>
          user.role !== 'admin' &&
          user.role !== 'manager' &&
          user.hasManager == false
      );
    });
  }

  editUserRole(user: User, newRole: string) {
    this.userService.updateUserRole(user.id!, newRole).subscribe({
      next: (response) => {
        console.log(response.message); // Handle success message
      },
      error: (error) => {
        console.error('Error updating role:', error); // Handle error
      },
    });
  }

  deleteUser(user: User) {
    // Example method to delete user (for admins)
    // Implement logic to confirm deletion and delete user from Firestore
    // console.log('Deleting user:', user);
    // // Optional: Show confirmation dialog and handle deletion
    // this.userService.deleteUser(user.id).subscribe(() => {
    //   this.toastr.success(`${user.userName} deleted successfully`);
    //   // Reload users after deletion
    //   this.loadUsers();
    // });
  }

  assignManager(user: User, userId: string | null) {
    console.log(user, userId);

    // Get the current managedUsers array of the selected manager
    const currentManagedUsers = user.managedUsers || [];

    // Check if managerId is null (to remove manager assignment)
    if (userId === null) {
      // Remove this user from any existing manager's managedUsers
      currentManagedUsers.forEach((userId: string) => {
        this.managerService.removeManagerFromUser(userId, user.id!).subscribe(
          () => {
            // Successfully removed from existing manager's managedUsers
          },
          (error) => {
            console.error('Error removing user from manager:', error);
          }
        );
      });
    } else {
      // Add this user to the new manager's managedUsers
      this.managerService.addUserToManager(userId, user.id!).subscribe(
        (res) => {
          console.log(res);

          // Successfully added to new manager's managedUsers
        },
        (error) => {
          console.error('Error adding user to manager:', error);
        }
      );
    }
  }
}
