import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseProviderService {

  private apiUrl: string = environment.apiUrl + 'DatabaseProvider';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetProviders(): Observable<{ [key: string]: boolean }> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.get<{ [key: string]: boolean }>(`${this.apiUrl}/GetProviders`, { headers });
  }
  UpdateProvider(provider: string): Observable<void> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<void>();
    }

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    return this.http.put<void>(`${this.apiUrl}/UpdateProvider?Provider=${provider}`, null, { headers });
  }
}
