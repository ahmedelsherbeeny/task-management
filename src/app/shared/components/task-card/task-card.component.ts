import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/tasks/tasks';
import { User } from '../../models/user/user';
import { MessageService } from '../../services/message.service';
import { SweetAlertResult } from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Input() users!: User[];
  userRole: string | null = null; // Current user role
  @Output() emitTaskData: EventEmitter<any> = new EventEmitter();
  @Output() changeStatus: EventEmitter<any> = new EventEmitter();


  
  private subscriptions: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    public message: MessageService
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  assignTask(task: Task, newUser: User) {

    this.taskService
      .assignTask(task.id!, newUser.id!, newUser.userName!, task.assignedToId!)
      .subscribe({
        next: () => {

          this.message.toast("Task Assigned Successfully", "success");
          // Optionally, fetch tasks again or update UI
        },
        error: (error) => {

          this.message.toast(error, "error");
          // Handle error appropriately (e.g., show error message)
        },
      });
  }

  editTask(data: Task) {
    this.emitTaskData.emit({ taskData: data });
  }

  changeTaskStatus(task: Task, newStatus: string) {
    this.changeStatus.emit({task,newStatus})

      
  }

  deleteTask(task: Task) {
    this.message
      .confirm(
        "Delete!",
        "Are you sure you want to delete it?",
        "primary",
        "question"
      )
      .then((result: SweetAlertResult) => {
        if (result.isConfirmed) {

          const deleteSubscription = this.taskService.deleteTask(task.id!).subscribe({
            next: () => {

              this.message.toast(`Task ${task.title} deleted Successfully`, "success");
            },
            error: (error) => {

              this.message.toast(error, "error");
              // Handle error as needed
            },
          });
          this.subscriptions.push(deleteSubscription);
        } else {
          return;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe()); // Unsubscribe from all subscriptions
  }
}
