import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChannelStatus } from '../Interfaces/ChannelStatus';
import { Observable } from 'rxjs';

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
}
