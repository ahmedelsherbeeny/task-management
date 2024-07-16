import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;
  @Input() users!: any[];
  userRole: string | null = null; // Current user role
  @Output()
  emitTaskData: EventEmitter<any> = new EventEmitter();
  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
  }

  assignTask(task: any, newUser: any) {
    this.taskService
      .assignTask(task.id, newUser.id, newUser.userName, task.assignedToId)
      .subscribe({
        next: () => {
          console.log('Task assigned successfully');
          // Optionally, fetch tasks again or update UI
        },
        error: (error) => {
          console.error('Error assigning task:', error);
          // Handle error appropriately (e.g., show error message)
        },
      });
  }

  editTask(data: any) {
    this.emitTaskData.emit({ taskData: data });
  }

  changeTaskStatus(task: any, newStatus: string) {
    this.taskService.changeTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        task.status = newStatus; // Update local task status
        console.log(`Task status updated to ${newStatus}`);
        // Optionally, you can add further logic after status change
      },
      error: (error) => {
        console.error('Error changing task status:', error);
        // Handle error as needed
      },
    });
  }

  deleteTask(task: any) {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        console.log(`Task ${task.title} deleted`);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        // Handle error as needed
      },
    });
  }
}
