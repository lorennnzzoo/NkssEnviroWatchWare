import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Station } from '../../../Interfaces/Station';
import { StationService } from '../../../Services/station.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { EmailFrequency, ReportRange, ReportSubscriptionCreate } from '../../../Interfaces/AutoMailReport';
import { DatePickerModule } from 'primeng/datepicker'
import { AutoMailReportService } from '../../../Services/auto-mail-report.service';


@Component({
  selector: 'app-create-susbcription',
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, DatePickerModule],
  templateUrl: './create-susbcription.component.html',
  styleUrl: './create-susbcription.component.css',
  providers: [ToastrService]
})
export class CreateSusbcriptionComponent implements OnInit {

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


  subscriptionForm!: FormGroup;
  Stations: Station[] = [];
  Loading: boolean = false;
  constructor(private fb: FormBuilder, private location: Location, private toastService: ToastrService, private stationService: StationService, private autoMailReportService: AutoMailReportService) { }
  ngOnInit(): void {
    this.subscriptionForm = this.fb.group({
      StationId: [null, Validators.required],
      Interval: [null, Validators.required],
      Range: [null, Validators.required],
      EmailScheduleTime: [null, Validators.required],
      Frequency: [null, Validators.required]
    })
    this.loadStations();
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

    const reportSubscription: ReportSubscriptionCreate = {
      StationId: this.subscriptionForm.value.StationId,
      Interval: this.subscriptionForm.value.Interval,
      Range: this.subscriptionForm.value.Range,
      EmailScheduleTime: formattedTime,
      Frequency: this.subscriptionForm.value.Frequency
    };


    console.log(reportSubscription);

    this.autoMailReportService.CreateSubscription(reportSubscription).subscribe({
      next: (resposne) => {
        this.Loading = false;
        this.toastService.success("Subscription Created Successfully.");
        this.goBack();
      },
      error: (error) => {
        this.Loading = false;
        console.error(error);
        this.toastService.error(error.error)
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
