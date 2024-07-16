import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}
  ngOnInit(): void {
    this.fetchUserTasks();
  }

  fetchUserTasks() {
    const userId = localStorage.getItem('userUUID');
    if (userId) {
      this.taskService.getUserTasks(userId).subscribe({
        next: (tasks: any[]) => {
          this.tasks = tasks.filter((task) => task !== null);
          console.log(this.tasks);
        },
        error: (error) => {
          console.error('Error fetching user tasks:', error);
        },
      });
    }
  }
}
