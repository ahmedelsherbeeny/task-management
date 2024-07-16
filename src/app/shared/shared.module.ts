import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TaskCardComponent } from './components/task-card/task-card.component';

@NgModule({
  declarations: [NotFoundComponent, HeaderComponent, TaskCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent],
})
export class SharedModule {}
