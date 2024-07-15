import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[HeaderComponent]
})
export class SharedModule { }
