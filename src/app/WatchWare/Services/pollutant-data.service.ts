import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollutantDataService {

  private apiUrl: string = environment.apiUrl + 'PollutantData';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }


  uploadCsv(file: File): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }

    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/UploadBulk`, formData, { headers, responseType: 'text' });
  }
}
