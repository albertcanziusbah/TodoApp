import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CognitoUser, ISignUpResult } from 'amazon-cognito-identity-js';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent {
    isLoginMode = true;
    displaySwitchToConfirm = true;
    isLoading: boolean = false;
    error: string = null;
    userSuccess: string = null;

    constructor(private authService: AuthService, private router: Router) {

    }
    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
        this.displaySwitchToConfirm = true;
        this.error = null;
        this.userSuccess = null;
    }

    onSwitchToConfirm(){
        this.displaySwitchToConfirm = false;
        this.isLoginMode = false;
        this.error = null;
        this.userSuccess = null;
    }

    onSubmit(form: NgForm) {
    
        this.isLoading = true;
         
        let signUpPromise: Promise<ISignUpResult>;
        let resPromise: Promise< CognitoUser | any> = null;
        if (!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        
        
        

        if(this.isLoginMode){
          resPromise = this.authService.login(email,password);
          resPromise.then( resData => {
              
              console.log(resData);
              this.router.navigate(['/todo']);
            });
            resPromise.catch( retError => { this.error = retError.message});
            this.isLoading = false;
        } else if(!this.displaySwitchToConfirm) {
            resPromise = this.authService.confirmSignUp(email,form.value.code);
            resPromise.then( resData => {
                console.log(resData);
                this.userSuccess = resData;
            });
            resPromise.catch( retError => { this.error = retError.message});
            this.isLoading = false;
        } else {
            resPromise = this.authService.signup(email,password);
            resPromise.then( resData => {
                
                this.userSuccess = `Please check your ${resData.codeDeliveryDetails.DeliveryMedium} : ${resData.codeDeliveryDetails.Destination} for a confirmation code `;
                console.log(resData);
            });
            
            resPromise.catch( retError => { this.error = retError.message});
            this.isLoading = false;
        }
        form.reset();
    
    }
}