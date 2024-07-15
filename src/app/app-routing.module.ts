import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthGuard } from './core/guards/authguard.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }, // Redirect to auth by default

  {
    path: "",
    component: LayoutComponent,
    loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule),
    canActivate:[AuthGuard]

  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
 
  { path: '**', component:NotFoundComponent }, // Redirect unknown routes to auth
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
