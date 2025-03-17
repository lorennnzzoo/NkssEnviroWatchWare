import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { SiteConfigReportFilter } from '../Interfaces/ReportSubmitFilter';
import { ConfigSetting } from '../Interfaces/ConfigSetting';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConfigurationService {

  private apiUrl: string = environment.apiUrl + 'Configuration';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  GetConfiguration(): Observable<{ [key: string]: any }> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/Login']);
      return new Observable<any>();
    }

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.get<{ [key: string]: any }>(`${this.apiUrl}/GetConfiguration`, { headers });
  }

  GetUploadConfiguration(configFilter: SiteConfigReportFilter): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/Login']);
      return new Observable<any>();
    }

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    let params = new HttpParams();
    params = params.set('companyId', configFilter.companyId ? configFilter.companyId.toString() : '')
      .set('stationsId', configFilter.stationsId.join(','))
      .set('channelsId', configFilter.channelsId.join(','))

    return this.http.post(`${this.apiUrl}/GetUploadConfig`, params, { headers });
  }


  GetApiContracts(): Observable<ConfigSetting[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/Login']);
      return new Observable<ConfigSetting[]>();
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ConfigSetting[]>(`${this.apiUrl}/GetApiContracts`, { headers });
  }




}
