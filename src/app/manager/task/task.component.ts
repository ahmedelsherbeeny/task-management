import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from 'src/app/shared/services/task.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  taskForm!: FormGroup;
  taskId!: string | null;
  isEditMode: boolean = false;
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public modal: NgbActiveModal,

  ) {
    // this.taskId = this.route.snapshot.paramMap.get('id');
    // this.isEditMode = !!this.taskId;

   

    this.userService.getUsers().subscribe(users => {
      this.users = users.filter(user => user.role === 'user');
    });
  }

  ngOnInit(): void {
    this.initTaskForm()
    if (this.isEditMode) {
      this.taskService.getTask(this.taskId!).subscribe((task) => {
        this.taskForm.patchValue(task);
      });
    }
  }

  initTaskForm(){
    this.taskForm = this.fb.group({
      assignedTo: ['Not Assigned Yet'],
      createdBy: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['To Do']
    });

  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: any = {
        ...this.taskForm.getRawValue(),
        // createdBy: this.authService.getCurrentUser().userId
      };
      

      if (this.isEditMode) {
        this.taskService.updateTask(this.taskId!, task).subscribe(() => {
          this.modal.close()
          this.router.navigate(['/tasks']);
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.modal.close()

          this.router.navigate(['/manager/task-management']);
        });
      }
    }
  }

}

