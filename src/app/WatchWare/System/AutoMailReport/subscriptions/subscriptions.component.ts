import { Component, OnInit } from '@angular/core';
import { EmailFrequency, ReportRange, ReportSubscription, ReportSubscriptionListView } from '../../../Interfaces/AutoMailReport';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AutoMailReportService } from '../../../Services/auto-mail-report.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { StationService } from '../../../Services/station.service';
import { Station } from '../../../Interfaces/Station';
import { DataAggregationType } from '../../../Interfaces/ReportSubmitFilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-subscriptions',
  imports: [ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ConfirmDialogModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class SubscriptionsComponent implements OnInit {
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
  RawSubscriptions: ReportSubscription[] = [];
  SubscriptionsLoading: boolean = false;
  Subscriptions: ReportSubscriptionListView[] = [];
  Stations: Station[] = []

  constructor(private toastService: ToastrService, private autoMailReportService: AutoMailReportService, private router: Router, private stationService: StationService, private dialogService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadStations();
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.SubscriptionsLoading = true;
    this.autoMailReportService.GetAllReportSubscriptions().subscribe({
      next: (response) => {
        this.RawSubscriptions = response;
        this.Subscriptions = this.mapSubscriptions();
        this.SubscriptionsLoading = false;
      },
      error: (error) => {
        this.SubscriptionsLoading = false;
        console.error(error);
        this.toastService.error("unable to fetch subscriptions.");
      }
    })
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onCreate() {
    this.router.navigate(['/System/Configuration/AutoMailReport/CreateSubscription'])
  }
  loadStations() {
    this.SubscriptionsLoading = true;
    this.stationService.GetAllStations().subscribe({
      next: (response) => {
        this.Stations = response;
        this.SubscriptionsLoading = false;
      },
      error: (error) => {
        this.SubscriptionsLoading = false;
        console.error(error);
        this.toastService.error("unable to load stations.");
      }
    })
  }
  private mapSubscriptions(): ReportSubscriptionListView[] {
    return this.RawSubscriptions.map((sub) => ({
      Id: sub.Id,
      Station: this.Stations.find(s => s.Id === sub.StationId)?.Name || 'Unknown',
      Interval: this.getEnumLabel(this.intervalOptions, sub.Interval),
      Range: this.getEnumLabel(this.rangeOptions, sub.Range),
      EmailScheduleTime: sub.EmailScheduleTime,
      Frequency: this.getEnumLabel(this.frequencyOptions, sub.Frequency),
    }));
  }
  private getEnumLabel(options: { label: string; value: any }[], value: any): string {
    return options.find(opt => opt.value === value)?.label || 'Unknown';
  }
  onManageContacts() {
    this.router.navigate(['/System/Configuration/Notification/Contacts'])
  }
  onEdit(subscription: ReportSubscriptionListView) {
    this.router.navigate(['/System/Configuration/AutoMailReport/EditSubscription', subscription.Id]);
  }
  onDelete(subscription: ReportSubscriptionListView) {
    this.dialogService.confirm({
      message: 'Are you sure you want to delete this subscription?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // User clicked "Yes"
        this.autoMailReportService.DeleteSubscription(subscription.Id).subscribe
          ({
            next: (response) => {
              this.toastService.success('Subscription deleted successfully', 'Deleted');
              this.ngOnInit();
            },
            error: (error) => {
              this.toastService.error(error.error, 'Unable To Delete Subscription');
            }
          })
      },
      reject: () => {
        // User clicked "No"

      },
    });
  }
}
