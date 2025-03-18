import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ServiceLogs } from '../Interfaces/ServiceLog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl: string = environment.apiUrl + 'ServiceLogs';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetPast24HourLogs(Type: string): Observable<ServiceLogs[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<ServiceLogs[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Type', Type);
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ServiceLogs[]>(`${this.apiUrl}/GetPast24HourLogs`, { headers, params });
  }

  GetSoftwareTypes(): Observable<string[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<string[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<string[]>(`${this.apiUrl}/GetSoftwareTypes`, { headers });
  }
}
