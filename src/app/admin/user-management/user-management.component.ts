import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ManagerService } from 'src/app/manager/manager.service';
import { User } from 'src/app/shared/models/user/user';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/user/user.service';
import { SweetAlertResult } from 'sweetalert2';
import { AdminService } from '../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserManagementComponent {
  users: User[] = [];
  userRole: string | null = null;
  roleOptions: string[] = ['user', 'manager'];
  managableUsers: User[] = [];

  private subscriptions: Subscription[] = []; // Array to hold subscriptions

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private managerService: ManagerService,
    public message: MessageService
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.getUsersAndManager();
    this.loadManagableUsers();
  }

  getUsersAndManager(): void {
    const usersSubscription = this.userService.getUsers().subscribe((us) => {
      this.users = us.filter((user) => user.role !== 'admin');
    });
    this.subscriptions.push(usersSubscription); // Add subscription to array
  }

  loadManagableUsers(): void {
    const managableUsersSubscription = this.userService.getUsers().subscribe((users: User[]) => {
      this.managableUsers = users.filter(
        (user: User) =>
          user.role !== 'admin' &&
          user.role !== 'manager' &&
          user.hasManager === false
      );
    });
    this.subscriptions.push(managableUsersSubscription); // Add subscription to array
  }

  editUserRole(user: User, newRole: string): void {
    const editUserRoleSubscription = this.adminService.updateUserRole(user.id!, newRole).subscribe({
      next: (response) => {
        this.message.toast(response.message, 'success');
      },
      error: (error) => {
        console.log(error);
        
        this.message.toast(error, 'error');
      }
    });
    this.subscriptions.push(editUserRoleSubscription); // Add subscription to array
  }

  deleteUser(userId: string): void {
    this.message
      .confirm(
        'Delete!',
        'Are you sure you want to delete it?',
        'primary',
        'question'
      )
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          const deleteUserSubscription = this.adminService.deleteUser(userId).subscribe({
            next: () => {
              this.message.toast('User deleted successfully.', 'success');
            },
            error: (error) => {
              this.message.toast(error, 'error');
            }
          });
          this.subscriptions.push(deleteUserSubscription); // Add subscription to array
        }
      });
  }

  assignManager(user: User, userId: string | null): void {
    const currentManagedUsers = user.managedUsers || [];

    if (userId === null) {
      currentManagedUsers.forEach((userId: string) => {
        const removeManagerSubscription = this.managerService.removeManagerFromUser(userId, user.id!).subscribe(
          () => {
            this.message.toast('User removed successfully', 'success');
          },
          (error) => {
            this.message.toast(error, 'error');
          }
        );
        this.subscriptions.push(removeManagerSubscription); // Add subscription to array
      });
    } else {
      const addUserToManagerSubscription = this.managerService.addUserToManager(userId, user.id!).subscribe(
        (res) => {
          console.log(res);
          this.message.toast('User assigned successfully', 'success');
        },
        (error) => {
          this.message.toast(error, 'error');
        }
      );
      this.subscriptions.push(addUserToManagerSubscription); // Add subscription to array
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}
