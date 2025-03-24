import { Component, OnInit } from '@angular/core';
import { Channel } from '../../../Interfaces/Channel';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../Services/channel.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { Condition, ConditionType, Operator } from '../../../Interfaces/NotificationCondition';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-create-subscription',
  imports: [CommonModule, ToastrModule, TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule],
  templateUrl: './create-subscription.component.html',
  styleUrl: './create-subscription.component.css',
  providers: [ToastrService]
})
export class CreateSubscriptionComponent implements OnInit {

  channelId!: number;
  Conditions: Condition[] = [];
  Loading: boolean = false;
  SubscribeLoading: boolean = false;
  ChannelLoading: boolean = false;
  channel!: Channel;
  subscriptionForm!: FormGroup;
  selectedConditions: Condition[] = [];

  constructor(private channelService: ChannelService, private router: Router, private notificationService: NotificationService, private fb: FormBuilder, private toastService: ToastrService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.channelId = +id;
        this.loadChannelDetails(this.channelId);
        this.loadConditions();
      }
    });
  }
  loadChannelDetails(id: number) {
    this.ChannelLoading = true;
    this.channelService.GetChannelById(id).subscribe({
      next: (data) => {
        this.channel = data;
        this.ChannelLoading = false;
      },
      error: (error) => {
        this.ChannelLoading = false;
        this.toastService.error('Unable to load channel details');
        console.error(error);
      }
    })
  }
  loadConditions() {
    this.Loading = true;
    this.notificationService.GetConditions().subscribe({
      next: (data) => {
        // Assign a unique ID using index
        this.Conditions = data.map((condition, index) => ({
          ...condition,
          GeneratedId: index + 1, // Unique ID
        }));
        this.Loading = false;
      },
      error: (error) => {
        this.Loading = false;
        this.toastService.error("Unable to load conditions");
        console.error(error);
      }
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  onCreate() {
    this.router.navigate(['/System/Configuration/Notification/CreateCondition'])
  }
  getConditionTypeName(type: ConditionType): string {
    return ConditionType[type]; // Converts enum value to name
  }

  getOperatorName(operator: Operator): string {
    return Operator[operator]; // Converts enum value to name
  }
  onSubscribe() {
    this.SubscribeLoading = true;
    if (this.selectedConditions.length === 0) {
      this.toastService.warning("Please select atleast one condition to subscribe.");
      this.SubscribeLoading = false;
      return;
    }

    this.notificationService.Subscribe(this.channelId, this.selectedConditions).subscribe({
      next: (response) => {
        this.SubscribeLoading = false;
        this.toastService.success("Successfully subscribed");
      },
      error: (error) => {
        this.SubscribeLoading = false;
        this.toastService.error("Unable to subscribe");
        console.error(error);
      }
    })
  }
}
