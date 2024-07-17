import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/shared/models/tasks/tasks';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.fetchUserTasks();
  }

  fetchUserTasks() {
    const userId = localStorage.getItem('userUUID');
    if (userId) {
      this.taskService.getUserTasks(userId).subscribe({
        next: (tasks: Task[]) => {
          
          this.tasks = tasks.filter((task) => task !== null);
        },
        error: (error) => {
          console.error('Error fetching user tasks:', error);
        },
      });
    }
  }
}
