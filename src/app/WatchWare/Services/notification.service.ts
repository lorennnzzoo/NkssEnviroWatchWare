import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChannelStatus } from '../Interfaces/ChannelStatus';
import { Observable } from 'rxjs';
import { Condition, ConditionCreate, NotificationSubscription } from '../Interfaces/NotificationCondition';
import { Contact, ContactCreation, ContactDeletion, ContactEdition, ContactType } from '../Interfaces/Contact';
import { NotificationPreference, UpdatePreference } from '../Interfaces/Preference';
import { NotificationHistory } from '../Interfaces/NotificationHistory';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl: string = environment.apiUrl + 'Notification';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetChannelsStatuses(): Observable<ChannelStatus[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<ChannelStatus[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ChannelStatus[]>(`${this.apiUrl}/GetChannelsStatus`, { headers });
  }

  GetConditions(): Observable<Condition[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Condition[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Condition[]>(`${this.apiUrl}/GetConditions`, { headers });
  }

  CreateCondition(Condition: ConditionCreate): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('ConditionName', Condition.ConditionName)  // Convert to string if needed
      .set('ConditionType', Condition.ConditionType)
      .set('Cooldown', Condition.Cooldown)
      .set('Duration', Condition.Duration)  // Convert to string if needed
      .set('Operator', Condition.Operator)  // Convert to string if needed      
      .set('Threshold', Condition.Threshold)  // Convert to string if needed   

    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/CreateCondition`, params, { headers });
  }

  Subscribe(ChannelId: number, Conditions: Condition[]): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    const payload = {
      ChannelId: ChannelId,
      Conditions: Conditions  // Send the array of conditions
    };
    return this.http.post(`${this.apiUrl}/Subscribe`, payload, { headers });
  }

  UpdateSubscription(subscription: NotificationSubscription): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateSubscription`, subscription, { headers });
  }

  Unsubscribe(Id: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/Unsubscribe`, { headers, params });
  }


  GetSubscriptionOfChannel(ChannelId: number): Observable<NotificationSubscription> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<NotificationSubscription>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams();
    headers = headers.set('Authorization', 'Bearer ' + token);
    params.set('channelId', ChannelId);

    return this.http.get<NotificationSubscription>(`${this.apiUrl}/GetSubscriptionOfChannel?channelId=${ChannelId}`, { headers });
  }


  GetContacts(type: ContactType): Observable<Contact[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Contact[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Contact[]>(`${this.apiUrl}/GetContacts?type=${type}`, { headers });
  }

  CreateContact(creation: ContactCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    const payload = {
      type: creation.type,
      address: creation.address  // Send the array of conditions
    };
    return this.http.post(`${this.apiUrl}/CreateContact`, payload, { headers });
  }

  DeleteContact(deletion: ContactDeletion): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    const options = {
      headers: headers,
      body: {
        type: deletion.type,
        id: deletion.id
      }
    };

    return this.http.delete(`${this.apiUrl}/DeleteContact`, options);
  }


  EditContact(edition: ContactEdition): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/EditContact`, edition, { headers });
  }



  GetPreference(): Observable<NotificationPreference> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<NotificationPreference>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<NotificationPreference>(`${this.apiUrl}/GetPreference`, { headers });
  }

  UpdatePreference(preference: UpdatePreference): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.put(`${this.apiUrl}/UpdatePreference`, preference, { headers });
  }


  MultiChannelSubscribing(ids: number[]): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    const payload = {
      ChannelIds: ids,
    };
    return this.http.post(`${this.apiUrl}/MultiChannelSubscribe`, ids, { headers });
  }

  GetMultiChannelSubscriptionStatus(): Observable<ChannelStatus[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<ChannelStatus[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ChannelStatus[]>(`${this.apiUrl}/LoadMultiChannelSubscriptionStatus`, { headers });
  }


  GetAllNotifications(): Observable<NotificationHistory[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<NotificationHistory[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<NotificationHistory[]>(`${this.apiUrl}/GetAllNotifications`, { headers });
  }

  ReadNotification(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.put(`${this.apiUrl}/ReadNotification?id=${id}`, null, { headers });
  }

}
