import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ChannelType } from '../Interfaces/ChannelType';

@Injectable({
  providedIn: 'root'
})
export class ChannelTypeService {

  private apiUrl: string = environment.apiUrl + 'ChannelType';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllChannelTypes(): Observable<ChannelType[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<ChannelType[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<ChannelType[]>(`${this.apiUrl}/GetAllChannelTypes`, { headers });
  }

  GetChannelTypeById(Id: number): Observable<ChannelType> {
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
    return this.http.get<ChannelType>(`${this.apiUrl}/GetChannelType`, { headers, params });
  }
}
