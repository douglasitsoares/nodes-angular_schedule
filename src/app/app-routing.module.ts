import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { ScheduleListComponent } from "./schedules/schedule-list/schedule-list.component";
import { ScheduleCreateComponent } from "./schedules/schedule-create/schedule-create.component";
import { LoginComponent } from "./auth/login/Login.component";
import { SignupComponent } from "./auth/signup/Signup.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schedule', component: ScheduleListComponent, canActivate: [AuthGuard]},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'schedule/create', component: ScheduleCreateComponent, canActivate: [AuthGuard]},
  { path: 'schedule/edit/:scheduleId', component: ScheduleCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
