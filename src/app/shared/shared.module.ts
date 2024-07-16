import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [NotFoundComponent, HeaderComponent, TaskCardComponent],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  exports: [HeaderComponent, TaskCardComponent],
})
export class SharedModule {}
