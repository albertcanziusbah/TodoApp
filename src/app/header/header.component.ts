import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = true;
  private activeUserSub: Subscription;

  constructor(
    private authService: AuthService
  ) {}

ngOnInit() {
       
    this.activeUserSub = this.authService.activeUserSub.subscribe(active => {
      console.log("in active use subscription:  "+active);
      this.isAuthenticated = active;
      
    });
         
}
ngOnDestroy() {
    this.activeUserSub.unsubscribe();
}

onLogout() {
  this.authService.logout();
}

}