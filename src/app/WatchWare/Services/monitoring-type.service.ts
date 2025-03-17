import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { MonitoringType } from '../Interfaces/MonitoringType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoringTypeService {

  private apiUrl: string = environment.apiUrl + 'MonitoringType';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllMonitoringTypes(): Observable<MonitoringType[]> {
      const token = this.authService.getToken();  // Replace with your token fetching logic
      if (!token) {
        // Redirect to login if no token exists
        this.router.navigate(['/Login']);
        return new Observable<MonitoringType[]>();  // Return an empty observable to prevent further actions
      }
  
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + token);
  
      return this.http.get<MonitoringType[]>(`${this.apiUrl}/GetAllMonitoringTypes`, { headers });
    }


  GetMonitoringType(Id:number):Observable<MonitoringType>{
    const token = this.authService.getToken();  // Replace with your token fetching logic
      if (!token) {
        // Redirect to login if no token exists
        this.router.navigate(['/Login']);
        return new Observable<MonitoringType>();  // Return an empty observable to prevent further actions
      }
  
      let headers = new HttpHeaders();
      let params=new HttpParams()
      .set('Id',Id);
      headers = headers.set('Authorization', 'Bearer ' + token);
  
      return this.http.get<MonitoringType>(`${this.apiUrl}/GetMonitoringType`, { headers,params });
  }
}
