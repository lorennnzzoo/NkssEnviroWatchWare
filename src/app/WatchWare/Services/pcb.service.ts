import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChannelConfiguration, StationConfiguration, StationConfigurationCreate } from '../Interfaces/PCB/CPCB/Configurations';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PCBService {

  private apiUrl: string = environment.apiUrl + 'PCB';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetCPCBStationConfigurations(): Observable<StationConfiguration[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<StationConfiguration[]>();
    }

    let headers = new HttpHeaders();


    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<StationConfiguration[]>(`${this.apiUrl}/GetCPCBStationConfigurations`, { headers });
  }

  GetCPCBChannelConfigurationsByStation(id: number): Observable<ChannelConfiguration[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<ChannelConfiguration[]>();
    }

    let headers = new HttpHeaders();
    let params = new HttpParams().set('stationId', id)

    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ChannelConfiguration[]>(`${this.apiUrl}/GetCPCBChannelConfigurationsByStation`, { headers, params });
  }

  CreateCPCBStationConfiguration(configuration: StationConfigurationCreate): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    let params = new HttpParams()
      .set('StationId', configuration.StationId)
      .set('CPCB_StationId', configuration.CPCB_StationId)
      .set('CPCB_UserName', configuration.CPCB_UserName)
      .set('CPCB_Password', configuration.CPCB_Password)

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/CreateCPCBStationConfiguration`, params, { headers });
  }
}
