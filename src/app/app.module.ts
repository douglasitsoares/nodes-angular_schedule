import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";


import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { ScheduleCreateComponent } from "./schedules/schedule-create/schedule-create.component";
import { HeaderComponent } from "./header/header.component";
import { LoginComponent } from "./auth/login/Login.component";
import { SignupComponent } from "./auth/signup/Signup.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { ScheduleListComponent } from "./schedules/schedule-list/schedule-list.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostCreateComponent,
    ScheduleCreateComponent,
    HeaderComponent,
    PostListComponent,
    ScheduleListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [{provide : HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true},
              {provide : HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true}],

  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
