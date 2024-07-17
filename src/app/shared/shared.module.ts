import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [NotFoundComponent, HeaderComponent, TaskCardComponent, LoaderComponent],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  exports: [HeaderComponent, TaskCardComponent,LoaderComponent],
})
export class SharedModule {}
