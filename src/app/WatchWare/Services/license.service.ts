import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { License, LicenseEdit } from '../Interfaces/License';


@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private apiUrl: string = environment.apiUrl + 'License';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetLicenseByType(Type: string): Observable<License> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('type', Type)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<License>(`${this.apiUrl}/GetLicense`, { headers, params });
  }

  EditLicense(License: LicenseEdit): Observable<any> {
      const token = this.authService.getToken();  // Replace with your token fetching logic
      if (!token) {
        // Redirect to login if no token exists
        this.router.navigate(['/Login']);
        return new Observable<any>();  // Return an empty observable to prevent further actions
      }
      let headers = new HttpHeaders();
      let params = new HttpParams()
        .set('LicenseType', License.LicenseType)
        .set('LicenseKey', License.LicenseKey)
      headers = headers.set('Authorization', 'Bearer ' + token);
      return this.http.put(`${this.apiUrl}/UpdateLicense`, params, { headers });
    }

}
