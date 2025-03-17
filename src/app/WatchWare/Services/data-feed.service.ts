import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ChannelDataFeed } from '../Interfaces/ChannelDataFeed';
import { Observable } from 'rxjs';
import { ChannelDataResult } from '../Interfaces/ChannelDataResult';

@Injectable({
  providedIn: 'root'
})
export class DataFeedService {

  private apiUrl: string = environment.apiUrl + 'ChannelDataFeed';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  GetStationFeed(StationId: number): Observable<ChannelDataFeed[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<ChannelDataFeed[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', StationId)
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ChannelDataFeed[]>(`${this.apiUrl}/GetStationFeed`, { headers, params });
  }
  GetTwentyHourTrend(Id:number):Observable<ChannelDataResult[]>{
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<ChannelDataResult[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    let params=new HttpParams();
    params=params.set('id', Id);

    return this.http.get<ChannelDataResult[]>(`${this.apiUrl}/Get24HourTrendForStation`, { headers,params });
  }
}
