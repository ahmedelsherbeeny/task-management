import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const userUUID = localStorage.getItem('userUUID');
    const userRole = localStorage.getItem('userRole');

    if (!userUUID) {
      return of(this.router.createUrlTree(['/auth/login']));
    }

    if (userRole === 'admin') {
      console.log(userRole);

      return of(true);
    } else {
      return of(this.router.createUrlTree(['/auth/login']));
    }
  }
}
