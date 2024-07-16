import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, of, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userUUID = localStorage.getItem('userUUID');
    const userRole = localStorage.getItem('userRole');

    if (!userUUID) {
      return of(this.router.createUrlTree(['/auth/login']));
    }

    if (userRole === 'admin' || userRole === 'user') {
      return of(true);
    } else {
      return of(this.router.createUrlTree(['/auth/login']));
    }
  }
}
