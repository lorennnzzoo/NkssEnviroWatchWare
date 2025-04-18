import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ChannelConfiguration, ChannelConfigurationCreate, ChannelConfigurationEdit, StationConfiguration, StationConfigurationCreate, StationConfigurationEdit, SyncStatus } from '../Interfaces/PCB/CPCB/Configurations';
import { Observable } from 'rxjs';
import { UploadSettings } from '../Interfaces/PCB/UploadSettings';

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



  CreateCPCBChannelConfiguration(configuration: ChannelConfigurationCreate): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    let params = new HttpParams()
      .set('ChannelId', configuration.ChannelId)
      .set('StationId', configuration.StationId)
      .set('CPCB_ChannelId', configuration.CPCB_ChannelId)
      .set('CPCB_ChannelName', configuration.CPCB_ChannelName)
      .set('CPCB_Units', configuration.CPCB_Units)

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/CreateCPCBChannelConfiguration`, params, { headers });
  }

  GetCPCBStationConfigurationById(id: string): Observable<StationConfiguration> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<StationConfiguration>(`${this.apiUrl}/GetCPCBStationConfigurationById`, { headers, params });
  }

  GetCPCBChannelConfigurationById(id: string): Observable<ChannelConfiguration> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<ChannelConfiguration>(`${this.apiUrl}/GetCPCBChannelConfigurationById`, { headers, params });
  }

  UpdateCPCBStationConfiguration(stationConfiguration: StationConfigurationEdit): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', stationConfiguration.Id)
      .set('StationId', stationConfiguration.StationId)
      .set('CPCB_StationId', stationConfiguration.CPCB_StationId)
      .set('CPCB_UserName', stationConfiguration.CPCB_UserName)
      .set('CPCB_Password', stationConfiguration.CPCB_Password)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateCPCBStationConfiguration`, params, { headers });
  }

  UpdateCPCBChannelConfiguration(ChannelConfiguration: ChannelConfigurationEdit): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', ChannelConfiguration.Id)
      .set('ChannelId', ChannelConfiguration.ChannelId)
      .set('StationId', ChannelConfiguration.StationId)
      .set('CPCB_ChannelId', ChannelConfiguration.CPCB_ChannelId)
      .set('CPCB_ChannelName', ChannelConfiguration.CPCB_ChannelName)
      .set('CPCB_Units', ChannelConfiguration.CPCB_Units)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateCPCBChannelConfiguration`, params, { headers });
  }

  DeleteCPCBStationConfiguration(id: string): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteCPCBStationConfiguration`, { headers, params });
  }

  DeleteCPCBChannelConfiguration(id: string): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteCPCBChannelConfiguration`, { headers, params });
  }

  GetCPCBUploadSettings(): Observable<UploadSettings> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<UploadSettings>();
    }

    let headers = new HttpHeaders();


    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<UploadSettings>(`${this.apiUrl}/GetCPCBUploadSettings`, { headers });
  }

  UpdateCPCBUploadSettings(UploadSettings: UploadSettings): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('LiveUrl', UploadSettings.LiveUrl)
      .set('DelayUrl', UploadSettings.DelayUrl)
      .set('LiveInterval', UploadSettings.LiveInterval)
      .set('DelayInterval', UploadSettings.DelayInterval)
      .set('LiveRecords', UploadSettings.LiveRecords)
      .set('DelayRecords', UploadSettings.DelayRecords)

    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateCPCBUploadSettings`, params, { headers });
  }

  GetCPCBChannelSyncStatuses(): Observable<SyncStatus[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<SyncStatus[]>();
    }

    let headers = new HttpHeaders();


    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<SyncStatus[]>(`${this.apiUrl}/GetCPCBChannelSyncStatuses`, { headers });
  }
}
