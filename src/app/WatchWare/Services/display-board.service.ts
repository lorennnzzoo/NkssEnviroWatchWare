import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Template } from '../Interfaces/DisplayBoard';

@Injectable({
  providedIn: 'root'
})
export class DisplayBoardService {


  private apiUrl: string = environment.apiUrl + 'DisplayBoard';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  CreateDisplayBoardTemplate(Template: Template): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('FileName', Template.FileName)  // Convert to string if needed
      .set('FilePath', Template.FilePath)
      .set('FileType', Template.FileType)
      .set('TemplateContent', Template.TemplateContent)  // Convert to string if needed      

    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.post(`${this.apiUrl}/CreateTemplate`, params, { headers });
  }
}
