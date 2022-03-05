import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  isValid = true;
  private authStatusSub: Subscription;

  constructor( public authService: AuthService){}

  ngOnInit() {
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => {
         this.isLoading = false;
        }
      );
  }


  onLogin(form: NgForm){
    if (form.invalid){
      this.isValid = false;
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    //this.isValid = this.authService.getIsAuth();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
