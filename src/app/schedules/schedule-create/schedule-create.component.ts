import { Component, OnDestroy, OnInit} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { SchedulesService } from "../schedules.service";
import { Schedule } from "../schedule.model";
import { mimeType } from "../../middleware/mime-type.validator";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription} from "rxjs";

@Component({
  selector: "app-schedule-create",
  templateUrl: "./schedule-create.component.html",
  styleUrls: ["./schedule-create.component.css"]
})
export class ScheduleCreateComponent implements OnInit, OnDestroy {
  schedule: Schedule;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  userId: string;
  infoScheduleId =false;
  maxDate;
  private mode = "create";
  private scheduleId: string;
  private authStatusSub:Subscription;

  constructor(
    private authService: AuthService,
    public schedulesService: SchedulesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
      this.isLoading = false;
      this.maxDate = new Date();
      this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    });

    this.form = new FormGroup({
      service: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      details: new FormControl(null, { validators: [Validators.required] }),
      date:new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("scheduleId")) {
        this.mode = "edit";
        this.scheduleId = paramMap.get("scheduleId");
        this.isLoading = true;

        this.schedulesService.getSchedule(this.scheduleId).subscribe(scheduleData => {
          this.isLoading = false;
          this.schedule = {
            id: scheduleData._id,
            service: scheduleData.service,
            details: scheduleData.details,
            date: scheduleData.date,
            hour:scheduleData.hour,
            imagePath: scheduleData.imagePath,
            creator: scheduleData.creator
          };
          // Checking if the schedule is responsible by user logged
          if (this.userId === this.schedule.creator){
            this.infoScheduleId = true;
          }else{
            this.infoScheduleId = false;
          }


          this.form.setValue({
            service: this.schedule.service,
            details: this.schedule.details,
            date: this.schedule.date,
            image: this.schedule.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.scheduleId = null;
        this.infoScheduleId = true;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveSchedule() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.schedulesService.addSchedule(
        this.form.value.service,
        this.form.value.details,
        this.userId,
        this.form.value.date,
        null,
        this.form.value.image
      );
    } else {

      this.schedulesService.updateSchedule(
        this.scheduleId,
        this.form.value.service,
        this.form.value.details,
        this.form.value.date,
        null,
        this.form.value.image
      );

    }
    this.form.reset();
  }

  ngOnDestroy(){
      this.authStatusSub.unsubscribe();
  }
}
