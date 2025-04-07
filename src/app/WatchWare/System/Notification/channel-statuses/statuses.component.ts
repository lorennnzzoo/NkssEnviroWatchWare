import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

@Component({
  selector: 'app-statuses',
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, ToastrModule],
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.css',
  providers: [ToastrService]
})
export class StatusesComponent implements OnInit {
  Channels: ChannelStatus[] = [];
  Loading: boolean = false;

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private toastService: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.loadChannels();
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
}
