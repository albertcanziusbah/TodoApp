import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router){}
    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot):
        | boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
       
       
       return this.authService.activeUserSub.pipe(
        take(1),
        map(useractive => {
          const active = useractive;
          console.log(`active: ${useractive}`);
          if (active) {
              console.log("in guard active");
            return active;
          }
          return this.router.createUrlTree(['/auth']);
        })
        
      );
        
    }
}