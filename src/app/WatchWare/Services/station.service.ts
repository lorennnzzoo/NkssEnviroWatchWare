import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Station, StationCreation, StationEdit, StationListView } from '../Interfaces/Station';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private apiUrl: string = environment.apiUrl + 'Station';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllStationsByCompany(CompanyId: number): Observable<Station[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<Station[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('CompanyId', CompanyId)
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Station[]>(`${this.apiUrl}/GetAllStationsByCompany`, { headers, params });
  }


  CreateStation(Station: StationCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('CompanyId', Station.CompanyId)
      .set('Name', Station.Name)
      .set('MonitoringTypeId', Station.MonitoringTypeId)
      .set('IsCpcb', Station.IsCpcb)
      .set('IsSpcb', Station.IsSpcb);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddStation`, params, { headers });
  }

  GetStationById(Id: number): Observable<Station> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<Station>(`${this.apiUrl}/GetStation`, { headers, params });
  }

  EditStation(Station: StationEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Station.Id)
      .set('CompanyId', Station.CompanyId)
      .set('Name', Station.Name)
      .set('MonitoringTypeId', Station.MonitoringTypeId)
      .set('IsCpcb', Station.IsCpcb)
      .set('IsSpcb', Station.IsSpcb);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateStation`, params, { headers });
  }


  DeleteStation(Station: StationListView): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Station.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteStation`, { headers, params });
  }


  GetAllStations(): Observable<Station[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<Station[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Station[]>(`${this.apiUrl}/GetAllStations`, { headers });
  }
}
