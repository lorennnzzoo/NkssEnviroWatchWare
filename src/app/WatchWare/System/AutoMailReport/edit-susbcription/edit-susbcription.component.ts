import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { EmailFrequency, ReportRange, ReportSubscription } from '../../../Interfaces/AutoMailReport';
import { Station } from '../../../Interfaces/Station';
import { ToastrService } from 'ngx-toastr';
import { StationService } from '../../../Services/station.service';
import { AutoMailReportService } from '../../../Services/auto-mail-report.service';
import { Location } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-edit-susbcription',
  imports: [ReactiveFormsModule, CommonModule, DatePickerModule],
  templateUrl: './edit-susbcription.component.html',
  styleUrl: './edit-susbcription.component.css'
})
export class EditSusbcriptionComponent {
  intervalOptions = [
    { label: 'Raw', value: DataAggregationType.Raw },
    { label: '5 Min', value: DataAggregationType.FiveMin },
    { label: '15 Min', value: DataAggregationType.FifteenMin },
    { label: '30 Min', value: DataAggregationType.ThirtyMin },
    { label: '1 Hour', value: DataAggregationType.OneHour },
    { label: '1 Day', value: DataAggregationType.Day }
  ];

  rangeOptions = [
    { label: 'Past Day', value: ReportRange.PastDay },
    { label: 'Past Week', value: ReportRange.PastWeek },
    { label: 'Past Month', value: ReportRange.PastMonth }
  ];

  frequencyOptions = [
    { label: 'Daily', value: EmailFrequency.Daily },
    { label: 'Weekly', value: EmailFrequency.Weekly },
    { label: 'Monthly', value: EmailFrequency.Weekly }
  ];

  subscriptionId!: string;
  subscriptionForm!: FormGroup;
  Stations: Station[] = [];
  Loading: boolean = false;
  constructor(private fb: FormBuilder, private location: Location, private route: ActivatedRoute, private toastService: ToastrService, private stationService: StationService, private autoMailReportService: AutoMailReportService) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.subscriptionId = id;
        this.loadSubscriptionData(this.subscriptionId);
      }
    });
    this.subscriptionForm = this.fb.group({
      Id: [null, Validators.required],
      StationId: [null, Validators.required],
      Interval: [null, Validators.required],
      Range: [null, Validators.required],
      EmailScheduleTime: [null, Validators.required],
      Frequency: [null, Validators.required]
    })
    this.loadStations();
  }
  loadSubscriptionData(id: string) {
    this.autoMailReportService.GetSubscriptionById(id).subscribe({
      next: (subscription) => {
        console.log(subscription);
        const [hours, minutes, seconds] = subscription.EmailScheduleTime.split(':').map(Number);

        const timeOnlyDate = new Date();
        timeOnlyDate.setHours(hours, minutes, seconds || 0);

        this.subscriptionForm.patchValue({
          Id: subscription.Id,
          StationId: subscription.StationId,
          Interval: subscription.Interval,
          Range: subscription.Range,
          EmailScheduleTime: timeOnlyDate,
          Frequency: subscription.Frequency
        });
      }
    })
  }
  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.Loading = true;

    if (this.subscriptionForm.invalid) {

      this.toastService.warning('Please fill all required fields', 'Warning');
      this.Loading = false;
      return;
    }
    const timeOnly: Date = this.subscriptionForm.value.EmailScheduleTime;
    const formattedTime = timeOnly.toTimeString().split(' ')[0];
    const subscription: ReportSubscription = {
      Id: this.subscriptionForm.value.Id,
      StationId: this.subscriptionForm.value.StationId,
      Interval: this.subscriptionForm.value.Interval,
      Range: this.subscriptionForm.value.Range,
      EmailScheduleTime: formattedTime,
      Frequency: this.subscriptionForm.value.Frequency
    }

    this.autoMailReportService.UpdateSubscription(subscription).subscribe({
      next: (response) => {
        this.toastService.success('Updated successfully.');
        this.Loading = false;
        this.goBack();
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error("Unable to update");
      }
    })


  }
  loadStations() {
    this.stationService.GetAllStations().subscribe({
      next: (response) => {
        this.Stations = response;
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("unable to load stations.");
      }
    })
  }
}
