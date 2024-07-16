import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  taskForm!: FormGroup;
  taskId!: string | null;
  isEditMode: boolean = false;
  users: any[] = [];
  currentManager!: any;
  @Input() taskData!: any;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private managerService: ManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public modal: NgbActiveModal
  ) {
    // this.taskId = this.route.snapshot.paramMap.get('id');
    // this.isEditMode = !!this.taskId;

    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter((user) => user.role === 'user');
    });
  }

  ngOnInit(): void {
    this.fetchCurrentManager();
    this.initTaskForm();

    this.taskId = this.taskData?.data.id;
    this.isEditMode = !!this.taskId;
    if (this.isEditMode) {
      this.taskService.getTask(this.taskId!).subscribe((task) => {
        this.taskForm.patchValue(task);
      });
    }
  }

  fetchCurrentManager(): void {
    const managerId = localStorage.getItem('userUUID');
    if (managerId) {
      this.managerService.getCurrentManager(managerId).subscribe({
        next: (manager: any) => {
          this.currentManager = manager;
          console.log('Current Manager:', manager.userName);
          this.taskForm.controls['createdBy'].patchValue(
            this.currentManager.userName
          );
          // Perform any additional processing or binding here
        },
        error: (error) => {
          console.error('Error fetching current manager:', error);
        },
      });
    } else {
      console.error('Manager ID not found in localStorage');
    }
  }

  initTaskForm() {
    this.taskForm = this.fb.group({
      assignedTo: ['Not Assigned Yet'],
      createdBy: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['To Do'],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: any = {
        ...this.taskForm.getRawValue(),
      };

      if (this.isEditMode) {
        this.taskService.updateTask(this.taskId!, task).subscribe(() => {
          this.modal.close();
          this.router.navigate(['/manager/task-management']);
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.modal.close();

          this.router.navigate(['/manager/task-management']);
        });
      }
    }
  }
}
