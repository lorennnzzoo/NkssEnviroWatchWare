import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ChannelStatus } from '../../../Interfaces/ChannelStatus';
import { NotificationService } from '../../../Services/notification.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { NotificationPreference, UpdatePreference } from '../../../Interfaces/Preference';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-statuses',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ToastrModule, RadioButtonModule, DialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.css',
  providers: [ToastrService, ConfirmationService]
})
export class StatusesComponent implements OnInit {
  Channels: ChannelStatus[] = [];
  Loading: boolean = false;
  UpdatePreferenceLoading: boolean = false;
  SelectedChannels: ChannelStatus[] = [];
  MultiSubscribeLoading: boolean = false;

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private toastService: ToastrService, private router: Router) {
    this.preferenceForm = this.fb.group({
      preference: [NotificationPreference.OnePerChannel] // default
    });
  }
  ngOnInit(): void {
    this.loadMultiChannelStatus();
    this.loadChannels();
    this.loadPreference();
  }
  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  loadChannels() {
    this.Loading = true;
    this.notificationService.GetChannelsStatuses().subscribe({
      next: (data) => {
        this.Channels = data;
        this.Loading = false;
      },
      error: (error) => {
        this.toastService.error(error.error, 'Error');
        console.log(error);
        this.Loading = false;
      }
    })
  }
  onManageContacts() {
    this.router.navigate(['/System/Configuration/Notification/Contacts'])
  }
  onSubscribe(channel: ChannelStatus) {
    this.router.navigate(['/System/Configuration/Notification/Subscribe', channel.ChannelId])
  }
  onEditSubscription(channel: ChannelStatus) {
    this.router.navigate(['/System/Configuration/Notification/EditSubscription', channel.ChannelId])
  }



  notificationOptions = [
    { label: 'One per Channel', value: NotificationPreference.OnePerChannel },
    { label: 'Group by Station', value: NotificationPreference.GroupByStation },
    { label: 'Group All', value: NotificationPreference.GroupAll }
  ];
  showPreferenceDialog = false;
  preferenceForm!: FormGroup;
  loadPreference() {
    this.notificationService.GetPreference().subscribe({
      next: (response) => {
        this.preferenceForm.patchValue({
          preference: response
        });
      },
      error: (error) => {
        console.error(error);
        this.toastService.error("Unable to fetch preference");
      }
    });
  }


  savePreference() {
    this.UpdatePreferenceLoading = true;

    const preference: UpdatePreference = {
      Preference: this.preferenceForm.value.preference
    }

    this.notificationService.UpdatePreference(preference).subscribe({
      next: () => {
        this.showPreferenceDialog = false;
        this.toastService.success('Preference updated successfully');
        this.UpdatePreferenceLoading = false;
        this.loadPreference();
      },
      error: (error) => {
        console.error(error);
        this.toastService.error('Failed to update preference');
        this.UpdatePreferenceLoading = false;
      }
    });
  }


  onMultiSubscribe() {
    this.MultiSubscribeLoading = true;
    if (this.SelectedChannels.length === 0) {
      this.toastService.warning("Please select atleast one channel to subscribe.");
      this.MultiSubscribeLoading = false;
      return;
    }

    const ids: number[] = this.SelectedChannels.map(c => c.ChannelId);

    this.notificationService.MultiChannelSubscribing(ids).subscribe({
      next: (response) => {
        this.MultiSubscribeLoading = false;
        this.toastService.success("Successfully subscribed");
        this.loadMultiChannelStatus();
        this.loadChannels();
      },
      error: (error) => {
        this.MultiSubscribeLoading = false;
        console.error(error);
        this.toastService.error(error.error);
      }
    })
  }

  loadMultiChannelStatus() {
    this.Loading = true;
    this.notificationService.GetMultiChannelSubscriptionStatus().subscribe({
      next: (response) => {
        this.Loading = false;
        this.SelectedChannels = response;
      },
      error: (error) => {
        this.Loading = false;
        this.toastService.error("Unable to load multi status");
      }
    })
  }


  onCreateCondition() {
    this.router.navigate(['/System/Configuration/Notification/CreateCondition'])
  }
}
