import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ReportSubscription, ReportSubscriptionCreate } from '../Interfaces/AutoMailReport';

@Injectable({
  providedIn: 'root'
})
export class AutoMailReportService {

  private apiUrl: string = environment.apiUrl + 'AutoMailReport';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  GetAllReportSubscriptions(): Observable<ReportSubscription[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<ReportSubscription[]>();
    }

    let headers = new HttpHeaders();


    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ReportSubscription[]>(`${this.apiUrl}/GetSubscriptions`, { headers });
  }

  CreateSubscription(reportSubscription: ReportSubscriptionCreate): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    let params = new HttpParams()
      .set('StationId', reportSubscription.StationId)
      .set('Interval', reportSubscription.Interval)
      .set('Range', reportSubscription.Range)
      .set('EmailScheduleTime', reportSubscription.EmailScheduleTime)
      .set('Frequency', reportSubscription.Frequency)
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/CreateSubscription`, params, { headers });
  }

  GetSubscriptionById(Id: string): Observable<ReportSubscription> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<ReportSubscription>(`${this.apiUrl}/GetSubscription`, { headers, params });
  }

  UpdateSubscription(reportSubscription: ReportSubscription): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', reportSubscription.Id)
      .set('StationId', reportSubscription.StationId)
      .set('Interval', reportSubscription.Interval)
      .set('Range', reportSubscription.Range)
      .set('EmailScheduleTime', reportSubscription.EmailScheduleTime)
      .set('Frequency', reportSubscription.Frequency)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateSubscription`, params, { headers });
  }

  DeleteSubscription(id: string): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteSubscription`, { headers, params });
  }
}
