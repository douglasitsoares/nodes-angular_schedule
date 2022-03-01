import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment} from "../../environments/environment";
import { Schedule } from "./schedule.model";

const BACKEND_URL = environment.apiURL + "/schedule/";

@Injectable({ providedIn: "root" })
export class SchedulesService {
  private schedules: Schedule[] = [];
  private schedulesUpdated = new Subject<{schedules: Schedule[], scheduleCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getSchedules(schedulesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${schedulesPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; schedule: any; maxSchedules:number }>(BACKEND_URL + queryParams)
      .pipe(
        map(scheduleData => {

            return { schedule:
            scheduleData.schedule.map(schedule => {

              return {
              service: schedule.service,
              details: schedule.details,
              id: schedule._id,
              /*
              date: schedule.date,
              */
              hour: schedule.hour,
              imagePath: schedule.imagePath,

              creator: schedule.creator
            };
          }),
          maxSchedules: scheduleData.maxSchedules


          }
        })
      )
      //The result of schedules and quantity of scheduleed injectable on the code by observable method
      .subscribe(transformedScheduleData => {
        this.schedules = transformedScheduleData.schedule;
        this.schedulesUpdated.next({
          schedules: [...this.schedules],
          scheduleCount: transformedScheduleData.maxSchedules
        });
      });
  }

  getScheduleUpdateListener() {
    return this.schedulesUpdated.asObservable();
  }

  getSchedule(id: string) {
    return this.http.get<{ _id: string, service: string, details: string, hour: string, imagePath: string, creator:string }>(
      BACKEND_URL + id
    );
  }

  addSchedule(service: string, details: string, creator: string, hour: string, image: File) {
    const scheduleData = new FormData();
    scheduleData.append("service", service);
    scheduleData.append("details", details);
    scheduleData.append("creator", creator);
    scheduleData.append("hour", hour);
    scheduleData.append("image", image, service);
    this.http
      .post<{ message: string; post: Schedule }>(
        BACKEND_URL,
        scheduleData
      )
      .subscribe(responseData => {
        this.router.navigate(["/schedule/"]);
      });
  }

  updateSchedule(id: string, service: string, details: string, hour: string, image: File | string) {
    let scheduleData: Schedule | FormData;

    if (typeof image === "object") {
      scheduleData = new FormData();
      scheduleData.append("id", id);
      scheduleData.append("service", service);
      scheduleData.append("details", details);
      scheduleData.append("hour", hour);
      scheduleData.append("image", image, service);
    } else {
      scheduleData = {
        id: id,
        service: service,
        details: details,

        hour: hour,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, scheduleData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
}

  deleteSchedule(scheduleId: string) {
    return this.http
      .delete(BACKEND_URL + scheduleId);
  }
}
