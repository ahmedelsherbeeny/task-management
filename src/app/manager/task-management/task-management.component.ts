import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TaskComponent } from '../task/task.component';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';
import { ManagerService } from '../manager.service';
import { User } from 'src/app/shared/models/user/user';
import { Task } from 'src/app/shared/models/tasks/tasks';
import { MessageService } from 'src/app/shared/services/message.service';
import { Subscription } from 'rxjs';

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
  Loader = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private userService: UserService,
    private managerService: ManagerService,
    public message: MessageService
  ) {}

  ngOnInit(): void {
    this.userRole = JSON.parse(JSON.stringify(localStorage.getItem('userRole')));
    this.fetchTasks();
    this.fetchManagedUsers();
  }

  fetchTasks() {
    this.Loader = true;
    const taskSubscription = this.taskService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
        this.Loader = false;
      },
      (error) => {
        this.Loader = false;
        this.message.toast(error, 'error');
      }
    );
    this.subscriptions.push(taskSubscription);
  }

  fetchManagedUsers() {
    if (this.userRole === 'admin') {
      const userSubscription = this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users.filter((user: User) => user.role == 'user');
      });
      this.subscriptions.push(userSubscription);
    } else {
      const managerId = localStorage.getItem('userUUID');
      if (managerId) {
        const managerSubscription = this.managerService.fetchManagedUsers(managerId).subscribe({
          next: (users: User[]) => {
            this.users = users;
          },
          error: (error) => {
            console.error('Error fetching managed users:', error);
          },
        });
        this.subscriptions.push(managerSubscription);
      }
    }
  }

  openCreateTaskModal() {
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

  changeTaskStatus(e:any){


    const statusSubscription = this.taskService.changeTaskStatus(e.task.id!, e.newStatus).subscribe(res=>{
      if(res.message){


        this.message.toast(res.message, "success");

        
      }else{



        this.message.toast("error changing status", "error");


      }
    });
    this.subscriptions.push(statusSubscription);

    

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}
