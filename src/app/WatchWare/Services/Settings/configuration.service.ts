import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ConfigSetting, ConfigSettingCreation, ConfigSettingEdit } from '../../Interfaces/ConfigSetting';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private apiUrl: string = environment.apiUrl + 'ConfigSetting';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllConfigSettings(): Observable<ConfigSetting[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<ConfigSetting[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ConfigSetting[]>(`${this.apiUrl}/GetAllConfigSettings`, { headers });
  }


  DeleteConfigSetting(ConfigSetting: ConfigSetting): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', ConfigSetting.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteConfigSetting`, { headers, params });
  }

  CreateConfigSetting(ConfigSetting: ConfigSettingCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('GroupName', ConfigSetting.GroupName)
      .set('ContentName', ConfigSetting.ContentName)
      .set('ContentValue', ConfigSetting.ContentValue)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddConfigSetting`, params, { headers });
  }


  GetConfigSettingById(Id: number): Observable<ConfigSetting> {
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
    return this.http.get<ConfigSetting>(`${this.apiUrl}/GetConfigSetting`, { headers, params });
  }

  EditConfigSetting(ConfigSetting: ConfigSettingEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', ConfigSetting.Id)
      .set('GroupName', ConfigSetting.GroupName)
      .set('ContentName', ConfigSetting.ContentName)
      .set('ContentValue', ConfigSetting.ContentValue)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateConfigSetting`, params, { headers });
  }
}
