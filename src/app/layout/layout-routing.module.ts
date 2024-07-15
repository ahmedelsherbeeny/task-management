import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';
import { ManagerGuard } from '../core/guards/manager.guard';
import { UserGuard } from '../core/guards/users.guard';

const routes: Routes = [
  {
    path: 'admin',

    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('../manager/manager.module').then((m) => m.ManagerModule),
    canActivate: [ManagerGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
