import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChannelStatus } from '../Interfaces/ChannelStatus';
import { Observable } from 'rxjs';
import { Condition } from '../Interfaces/NotificationCondition';

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

  CreateCondition(Condition: Condition): Observable<any> {
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



  GetSubscribedConditionsOfChannel(ChannelId: number): Observable<Condition[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Condition[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams();
    headers = headers.set('Authorization', 'Bearer ' + token);
    params.set('channelId', ChannelId);

    return this.http.get<Condition[]>(`${this.apiUrl}/GetSubscribedConditionsOfChannel?channelId=${ChannelId}`, { headers });
  }
}
