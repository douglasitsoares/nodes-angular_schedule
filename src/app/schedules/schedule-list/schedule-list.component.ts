import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Schedule } from "../schedule.model";
import { SchedulesService } from "../schedules.service";

@Component({
  selector: "app-schedule-list",
  templateUrl: "./schedule-list.component.html",
  styleUrls: ["./schedule-list.component.css"]
})

export class ScheduleListComponent implements OnInit, OnDestroy {
  schedules: Schedule[] = [];
  isLoading = false;
  totalSchedules = 0;
  schedulesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private schedulesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public schedulesService: SchedulesService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.schedulesService.getSchedules(this.schedulesPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.schedulesSub = this.schedulesService
      .getScheduleUpdateListener()
      .subscribe((scheduleData: {schedules: Schedule[], scheduleCount: number}) => {
        this.isLoading = false;
        this.totalSchedules = scheduleData.scheduleCount;
        this.schedules = scheduleData.schedules;

      });
      //This mapped check out if the return of this function is authenticated true or false and set
      //the variant userIsAuthenticated
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.schedulesPerPage = pageData.pageSize;
    this.schedulesService.getSchedules(this.schedulesPerPage, this.currentPage);
  }

  onDelete(scheduleId: string) {
    this.isLoading = true;
    this.schedulesService.deleteSchedule(scheduleId).subscribe(() => {
      this.schedulesService.getSchedules(this.schedulesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.schedulesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
