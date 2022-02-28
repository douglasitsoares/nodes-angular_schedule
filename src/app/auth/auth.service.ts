import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

import { environment} from "../../environments/environment";

const BACKEND_URL = environment.apiURL + "/user";

@Injectable({ providedIn: "root" })
export class AuthService{
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;
  //private tokenTimer: NodeJS.Timer;
  private tokenTimer: any;

  constructor( private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  //This responsible to emmit information of token is authenticated or not
  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  //This return if token and authenticated is valid
  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string){
   const authData: AuthData = {email:email, password:password};

    this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe(() =>{
      this.router.navigate["/"];
    }, error =>{
      this.authStatusListener.next(false);
    });

  }

  login (email: string, password: string){
    const authData: AuthData = {email:email, password:password};
    this.http.post<{token:string, expiresIn:number, userId: string}>(BACKEND_URL + "/login", authData)
    .subscribe( response => {
      const token = response.token;
      this.token = token;
      //this token was authenticated
      if (token){
        const expiresInDuration = response.expiresIn;
        //console.log(expiresInDuration);
        //this.tokenTimer = setTimeout(() => {this.logout()}, expiresInDuration * 1000);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, error =>{
        this.authStatusListener.next(false);
    });
  }

  autoAuthData(){
    const authInformation = this.getAuthData();
    //Avoid error in case nothing is setup
    if (!authInformation){
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0){
      this.token = authInformation.token;
      this.userId = authInformation.userId
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer (duration : number){
    this.tokenTimer = setTimeout(() => {this.logout()}, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirarion");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate){
      return;
    }
    return { token: token, expirationDate: new Date(expirationDate), userId: userId }
  }
}
