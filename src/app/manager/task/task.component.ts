import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';
import { ManagerService } from '../manager.service';
import { User } from 'src/app/shared/models/user/user';
import { Task } from 'src/app/shared/models/tasks/tasks';
import { MessageService } from 'src/app/shared/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnDestroy {
  taskForm!: FormGroup;
  taskId!: string | null;
  isEditMode: boolean = false;
  users: any[] = [];
  currentManager!: User;
  @Input() taskData!: any;
  Loader: boolean = false;
  private subscriptions: Subscription[] = [];



  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private managerService: ManagerService,
    private router: Router,
    private userService: UserService,
    public modal: NgbActiveModal,
    public message: MessageService

  ) {
 

    const userSubscription=this.userService.getUsers().subscribe((users:User[]) => {
      this.users = users.filter((user:User) => user.role === 'user');
    });
    this.subscriptions.push(userSubscription);

  }
 

  ngOnInit(): void {
    this.fetchCurrentManager();
    this.initTaskForm();

    this.taskId = this.taskData?.data.id;
    this.isEditMode = !!this.taskId;
    if (this.isEditMode) {
      const userSubscription=this.taskService.getTask(this.taskId!).subscribe((task) => {
        this.taskForm.patchValue(task);
      });
      this.subscriptions.push(userSubscription);
    }

  }

  fetchCurrentManager(): void {
    const managerId = localStorage.getItem('userUUID');
    if (managerId) {
      const userSubscription=this.managerService.getCurrentManager(managerId).subscribe({
        next: (manager: any) => {
          this.currentManager = manager;
          this.taskForm.controls['createdBy'].patchValue(
            this.currentManager.userName!
          );
          // Perform any additional processing or binding here
        },
        error: (error) => {
          this.message.toast(error, "error");
        },
      });
      this.subscriptions.push(userSubscription);

    } else {
      this.message.toast('Manager ID not found in localStorage', "error");

    }
  }

  initTaskForm() {
    this.taskForm = this.fb.group({
      assignedTo: ['Not Assigned Yet'],
      createdBy: ['',Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['To Do'],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {

      this.Loader = true;

      const task: Task = {
        ...this.taskForm.getRawValue(),
      };

      if (this.isEditMode) {
        const userSubscription=this.taskService.updateTask(this.taskId!, task).subscribe(() => {
          this.Loader = false

          this.modal.close();
          this.message.toast("Updated Successfully", "success");

          this.router.navigate(['/manager/task-management']);
          this.subscriptions.push(userSubscription);

        },(error)=>{
          this.Loader = false

          this.message.toast(error, "error");

        });
      } else {
        const userSubscription=this.taskService.createTask(task).subscribe(() => {
          this.Loader = false;

          this.modal.close();
          this.message.toast("Created Successfully", "success");

          this.router.navigate(['/manager/task-management']);
          this.subscriptions.push(userSubscription);

        },(error)=>{
          this.Loader = false;

          this.message.toast(error, "error");

        });
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}
