import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ScalingFactor, ScalingFactorCreation, ScalingFactorEdit } from '../Interfaces/ScalingFactor';

@Injectable({
  providedIn: 'root'
})
export class ScalingFactorService {

  private apiUrl: string = environment.apiUrl + 'ScalingFactor';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  GetAllScalingFactors(): Observable<ScalingFactor[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<ScalingFactor[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ScalingFactor[]>(`${this.apiUrl}/GetAllScalingFactors`, { headers });
  }

  GetScalingFactorById(Id: number): Observable<ScalingFactor> {
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
    return this.http.get<ScalingFactor>(`${this.apiUrl}/GetScalingFactor`, { headers, params });
  }


  CreateScalingFactor(ScalingFactor: ScalingFactorCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('MinInput', ScalingFactor.MinInput)
      .set('MaxInput', ScalingFactor.MaxInput)
      .set('MinOutput', ScalingFactor.MinOutput)
      .set('MaxOutput', ScalingFactor.MaxOutput);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddScalingFactor`, params, { headers });
  }


  EditScalingFactor(ScalingFactor: ScalingFactorEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', ScalingFactor.Id)
      .set('MinInput', ScalingFactor.MinInput)
      .set('MaxInput', ScalingFactor.MaxInput)
      .set('MinOutput', ScalingFactor.MinOutput)
      .set('MaxOutput', ScalingFactor.MaxOutput);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateScalingFactor`, params, { headers });
  }



  DeleteScalingFactor(ScalingFactor: ScalingFactor): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', ScalingFactor.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteScalingFactor`, { headers, params });
  }
}
