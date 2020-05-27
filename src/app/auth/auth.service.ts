import { Injectable } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../../aws-exports';
import { BehaviorSubject } from 'rxjs';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';
Amplify.configure(awsconfig);
interface AuthResponseData {

}

@Injectable({providedIn: 'root'})
export class AuthService {
    activeUser: boolean = false;
    activeUserSub = new BehaviorSubject<boolean>(false);

    constructor(private router: Router){}

    async signup(email: string, password: string){
       
            const user = await Auth.signUp({
                username:email,
                password:password,
                attributes: {
                    email:email
                }
            });
            return user;
           
       

    }

    async login(email: string, password: string){
        const user = await Auth.signIn(email, password);
        this.activeUserSub.next(true);
        return user;
    }

    async logout() {
        await Auth.signOut();
        this.router.navigate(['/auth']);
        this.activeUser = false;
        this.activeUserSub.next(false);
      }

    async confirmSignUp(email: string,code: string){
       return await Auth.confirmSignUp(email, code);
    }
    async autoLogin() {
        
        let userExpired: boolean = false;
        const  cognitoUserPromise: Promise<CognitoUser> = await  Auth.currentAuthenticatedUser();
        console.log("returning from getauthuser");
        if(cognitoUserPromise instanceof CognitoUser){
            console.log("found user");
            userExpired = this.handleCognitoUser(cognitoUserPromise);
        } else {
            console.log("found promise");
            cognitoUserPromise.then( cUser => {
                userExpired = this.handleCognitoUser(cUser);
            });
       }
       if(userExpired){
           console.log("firing subject");
        this.activeUserSub.next(false);
            return;
        }
        console.log("user is active");
        this.activeUser = true;
        console.log("firing subject");
        this.activeUserSub.next(true);
        this.router.navigate(['/grammar']);
    }

    private handleCognitoUser(cUser: CognitoUser): boolean {
        const currentTime: number = Math.floor((new Date).getTime()/1000);
            const iat: number = cUser.getSignInUserSession().getAccessToken().getIssuedAt();
            const expiration: number = cUser.getSignInUserSession().getAccessToken().getExpiration();
            if( currentTime > expiration){
                return true;
            } else {
                return false;
            }

    }
}