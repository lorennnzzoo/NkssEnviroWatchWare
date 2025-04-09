import { Component, OnInit } from '@angular/core';
import { NotificationHistory } from '../../WatchWare/Interfaces/NotificationHistory';
import { NotificationService } from '../../WatchWare/Services/notification.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConditionType } from '../../WatchWare/Interfaces/NotificationCondition';

@Component({
  selector: 'app-notifications',
  imports: [ToastrModule, CommonModule, DialogModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  providers: [ToastrService]
})
export class NotificationsComponent implements OnInit {

  ConditionType = ConditionType;
  UnreadNotifications: NotificationHistory[] = [];
  UnreadNotificationsLoading: boolean = false;
  ReadNotificationLoadingMap: { [key: number]: boolean } = {};


  constructor(private notificationService: NotificationService, private toastService: ToastrService) { }
  ngOnInit(): void {
    this.LoadNotifications();
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  LoadNotifications() {
    this.UnreadNotificationsLoading = true;
    this.notificationService.GetAllNotifications().subscribe({
      next: (response) => {
        this.UnreadNotificationsLoading = false;
        this.UnreadNotifications = response;
      },
      error: (error) => {
        this.UnreadNotificationsLoading = false;
        console.error(error);
        this.toastService.info("unable to fetch notifications");
      }
    })
  }

  ReadNotification(notification: NotificationHistory) {
    this.ReadNotificationLoadingMap[notification.Id] = true;

    this.notificationService.ReadNotification(notification.Id).subscribe({
      next: () => {
        this.ReadNotificationLoadingMap[notification.Id] = false;
        const index = this.UnreadNotifications.findIndex(n => n.Id === notification.Id);
        if (index !== -1) {
          this.UnreadNotifications[index].IsRead = true;
        }
      },
      error: (error) => {
        this.ReadNotificationLoadingMap[notification.Id] = false;
        console.error(error);
      }
    });
  }


}
