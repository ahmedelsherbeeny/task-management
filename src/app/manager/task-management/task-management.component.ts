import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TaskComponent } from '../task/task.component';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {

  modalRef!: NgbModalRef;
  tasks:any[]=[]
  users: any[] = [];



  constructor(private modalService: NgbModal,private taskService:TaskService,
    private userService: UserService,private managerService:ManagerService

  ){

  }
  ngOnInit(): void {
    this.fetchTasks()
    this.fetchManagedUsers()

  }

  fetchTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      console.log(tasks);
      
      this.tasks = tasks;
    });
  }

  fetchManagedUsers() {
    const managerId = localStorage.getItem('userUUID');
    if (managerId) {
      this.managerService.fetchManagedUsers(managerId).subscribe({
        next: (users: any[]) => {
          this.users = users;
          console.log(users);
          
        },
        error: (error) => {
          console.error('Error fetching managed users:', error);
        }
      });
    }
  }

  assignTask(task: any, newUser: any) {
    this.taskService.assignTask(task.id, newUser.id, newUser.userName, task.assignedToId).subscribe({
      next: () => {
        console.log('Task assigned successfully');
        // Optionally, fetch tasks again or update UI
      },
      error: (error) => {
        console.error('Error assigning task:', error);
        // Handle error appropriately (e.g., show error message)
      }
    });
  }



  openCreateTaskModa() {
    this.modalRef = this.modalService.open(TaskComponent, {
      backdrop: "static",
      size: "lg",
      centered: true,
      modalDialogClass: "task-preview",
      backdropClass: "modal-backdrop-preview",
    });

   
  }


}
