import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Channel, ChannelCreation, ChannelEdit, ChannelListView } from '../Interfaces/Channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private apiUrl: string = environment.apiUrl + 'Channel';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllChannelsByStation(StationId: number): Observable<Channel[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Channel[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('stationId', StationId)
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Channel[]>(`${this.apiUrl}/GetAllChannelsByStation`, { headers, params });
  }


  CreateChannel(Channel: ChannelCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('StationId', Channel.StationId)  // Convert to string if needed
      .set('Name', Channel.Name)
      .set('LoggingUnits', Channel.LoggingUnits)
      .set('ProtocolId', Channel.ProtocolId)  // Convert to string if needed
      .set('ValuePosition', Channel.ValuePosition)  // Convert to string if needed
      .set('MaximumRange', Channel.MaximumRange)  // Convert to string if needed
      .set('MinimumRange', Channel.MinimumRange)  // Convert to string if needed
      .set('Threshold', Channel.Threshold)  // Convert to string if needed
      .set('CpcbChannelName', Channel.CpcbChannelName)
      .set('SpcbChannelName', Channel.SpcbChannelName)
      .set('OxideId', Channel.OxideId)  // Convert to string if needed
      .set('Priority', Channel.Priority)  // Convert to string if needed
      .set('IsSpcb', Channel.IsSpcb)  // Convert boolean to string
      .set('IsCpcb', Channel.IsCpcb)  // Convert boolean to string
      .set('ScalingFactorId', Channel.ScalingFactorId)  // Convert to string if needed
      .set('OutputType', Channel.OutputType)
      .set('ChannelTypeId', Channel.ChannelTypeId)  // Convert to string if needed
      .set('ConversionFactor', Channel.ConversionFactor);  // Convert to string if needed

    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/AddChannel`, params, { headers });
  }


  GetChannelById(Id: number): Observable<Channel> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<Channel>(`${this.apiUrl}/GetChannel`, { headers, params });
  }
  EditChannel(Channel: ChannelEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Channel.Id)
      .set('StationId', Channel.StationId)  // Convert to string if needed
      .set('Name', Channel.Name)
      .set('LoggingUnits', Channel.LoggingUnits)
      .set('ProtocolId', Channel.ProtocolId)  // Convert to string if needed
      .set('ValuePosition', Channel.ValuePosition)  // Convert to string if needed
      .set('MaximumRange', Channel.MaximumRange)  // Convert to string if needed
      .set('MinimumRange', Channel.MinimumRange)  // Convert to string if needed
      .set('Threshold', Channel.Threshold)  // Convert to string if needed
      .set('CpcbChannelName', Channel.CpcbChannelName)
      .set('SpcbChannelName', Channel.SpcbChannelName)
      .set('OxideId', Channel.OxideId)  // Convert to string if needed
      .set('Priority', Channel.Priority)  // Convert to string if needed
      .set('IsSpcb', Channel.IsSpcb)  // Convert boolean to string
      .set('IsCpcb', Channel.IsCpcb)  // Convert boolean to string
      .set('ScalingFactorId', Channel.ScalingFactorId)  // Convert to string if needed
      .set('OutputType', Channel.OutputType)
      .set('ChannelTypeId', Channel.ChannelTypeId)  // Convert to string if needed
      .set('ConversionFactor', Channel.ConversionFactor)  // Convert to string if needed
      .set('CreatedOn', Channel.CreatedOn.toString());
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateChannel`, params, { headers });
  }


  DeleteChannel(Channel: ChannelListView): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Channel.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteChannel`, { headers, params });
  }

  GetAllChannels(): Observable<Channel[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Channel[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<Channel[]>(`${this.apiUrl}/GetAllChannels`, { headers });
  }
}
