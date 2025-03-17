import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Oxide, OxideCreation, OxideEdit } from '../Interfaces/Oxide';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OxideService {

  private apiUrl: string = environment.apiUrl + 'Oxide';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllOxides(): Observable<Oxide[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<Oxide[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Oxide[]>(`${this.apiUrl}/GetAllOxides`, { headers });
  }

  GetOxideById(Id: number): Observable<Oxide> {
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
    return this.http.get<Oxide>(`${this.apiUrl}/GetOxide`, { headers, params });
  }

  CreateOxide(Oxide: OxideCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('OxideName', Oxide.OxideName)
      .set('Limit', Oxide.Limit);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddOxide`, params, { headers });
  }

  EditOxide(Oxide: OxideEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Oxide.Id)
      .set('OxideName', Oxide.OxideName)
      .set('Limit', Oxide.Limit)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateOxide`, params, { headers });
  }


  DeleteOxide(Oxide: Oxide): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Oxide.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteOxide`, { headers, params });
  }
}
