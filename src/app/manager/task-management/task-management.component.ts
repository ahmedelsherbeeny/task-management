import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TaskComponent } from '../task/task.component';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';
import { ManagerService } from '../manager.service';
import { User } from 'src/app/shared/models/user/user';
import { Task } from 'src/app/shared/models/tasks/tasks';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss'],
})
export class TaskManagementComponent implements OnInit {
  modalRef!: NgbModalRef;
  tasks: Task[] = [];
  users: User[] = [];
  onlyUsers: User[] = [];
  userRole!: string;
  Loader: boolean = false;

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private userService: UserService,
    private managerService: ManagerService,
    public message: MessageService
  ) {}
  ngOnInit(): void {
    this.userRole = JSON.parse(
      JSON.stringify(localStorage.getItem('userRole'))
    );

    this.fetchTasks();
    this.fetchManagedUsers();
  }

  fetchTasks() {
    this.Loader = true;
    this.taskService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
        this.Loader = false;
      },
      (error) => {
        this.Loader = false;

        this.message.toast(error, 'error');
      }
    );
  }

  fetchManagedUsers() {
    if (this.userRole === 'admin') {
      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users.filter((user: User) => user.role == 'user');
      });

      return;
    } else {
      const managerId = localStorage.getItem('userUUID');
      if (managerId) {
        this.managerService.fetchManagedUsers(managerId).subscribe({
          next: (users: User[]) => {
            this.users = users;
          },
          error: (error) => {
            console.error('Error fetching managed users:', error);
          },
        });
      }
    }
  }

  openCreateTaskModa() {
    this.modalRef = this.modalService.open(TaskComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
      modalDialogClass: 'task-preview',
      backdropClass: 'modal-backdrop-preview',
    });
  }

  editTask(e: any) {
    this.modalRef = this.modalService.open(TaskComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
      modalDialogClass: 'task-preview',
      backdropClass: 'modal-backdrop-preview',
    });
    (this.modalRef.componentInstance as TaskComponent).taskData = {
      data: e.taskData,
      edit: true,
    };
  }
}
