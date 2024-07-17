import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ManagerService } from 'src/app/manager/manager.service';
import { User } from 'src/app/shared/models/user/user';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/user/user.service';
import { SweetAlertResult } from 'sweetalert2';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserManagementComponent {
  users: User[] = [];
  userRole: string | null = null; // Current user role
  roleOptions: string[] = ['user', 'manager']; // Role options for editing
  managableUsers: User[] = [];

  constructor(
    private userService: UserService,
    private adminService: AdminService,

    private managerService: ManagerService,
    public message: MessageService // private toastr: ToastrService // Optional: Toastr for notifications
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.getUsersAndManager();
    this.loadManagableUsers();
  }

  getUsersAndManager() {
    this.userService.getUsers().subscribe((us) => {
      this.users = us.filter((user) => user.role !== 'admin');
    });
  }

  loadManagableUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.managableUsers = users.filter(
        (user: User) =>
          user.role !== 'admin' &&
          user.role !== 'manager' &&
          user.hasManager == false
      );
    });
  }

  editUserRole(user: User, newRole: string) {
    this.adminService.updateUserRole(user.id!, newRole).subscribe({
      next: (response) => {
        this.message.toast(response.message, 'success');
      },
      error: (error) => {
        this.message.toast(error, 'error');
      },
    });
  }

  deleteUser(userId: string) {
    this.message
      .confirm(
        'Delete!',
        'Are you sure you want to delete it?',
        'primary',
        'question'
      )
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.adminService.deleteUser(userId).subscribe({
            next: () => {
              this.message.toast('User deleted successfully.', 'success');

              // Optionally, you can refresh the user list or perform any necessary actions.
            },
            error: (error) => {
              this.message.toast(error, 'error');

              // Handle error as needed, such as displaying an error message.
            },
          });
        } else {
          return;
        }
      });
  }

  assignManager(user: User, userId: string | null) {
    // Get the current managedUsers array of the selected manager
    const currentManagedUsers = user.managedUsers || [];

    // Check if managerId is null (to remove manager assignment)
    if (userId === null) {
      // Remove this user from any existing manager's managedUsers
      currentManagedUsers.forEach((userId: string) => {
        this.managerService.removeManagerFromUser(userId, user.id!).subscribe(
          () => {
            // Successfully removed from existing manager's managedUsers
            this.message.toast('User removed Succesfully', 'success');
          },
          (error) => {
            this.message.toast(error, 'error');
          }
        );
      });
    } else {
      // Add this user to the new manager's managedUsers
      this.managerService.addUserToManager(userId, user.id!).subscribe(
        (res) => {
          console.log(res);
          this.message.toast('User Assigned Succesfully', 'success');

          // Successfully added to new manager's managedUsers
        },
        (error) => {
          this.message.toast(error, 'error');
        }
      );
    }
  }
}
