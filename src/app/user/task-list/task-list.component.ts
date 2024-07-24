import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/shared/models/tasks/tasks';
import { MessageService } from 'src/app/shared/services/message.service';
import { TaskService } from 'src/app/shared/services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  private subscriptions: Subscription[] = [];


  constructor(private taskService: TaskService,private message:MessageService) {}
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
