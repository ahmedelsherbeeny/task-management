import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
