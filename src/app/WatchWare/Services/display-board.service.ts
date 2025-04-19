import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Template, TemplateCreate } from '../Interfaces/DisplayBoard';

@Injectable({
  providedIn: 'root'
})
export class DisplayBoardService {


  private apiUrl: string = environment.apiUrl + 'DisplayBoard';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  CreateDisplayBoardTemplate(Template: TemplateCreate): Observable<any> {
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


  GetAllTemplates(): Observable<Template[]> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<Template[]>();
    }

    let headers = new HttpHeaders();


    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Template[]>(`${this.apiUrl}/GetAllTemplates`, { headers });
  }

  DeleteTemplate(id: string): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteTemplate`, { headers, params });
  }


  GetTemplateById(Id: string): Observable<Template> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<Template>(`${this.apiUrl}/GetTemplate`, { headers, params });
  }

  UpdateTemplate(template: Template): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {

      this.router.navigate(['/login']);
      return new Observable<any>();
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', template.Id)
      .set('FileName', template.FileName)
      .set('FilePath', template.FilePath)
      .set('FileType', template.FileType)
      .set('TemplateContent', template.TemplateContent)

    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateTemplate`, params, { headers });
  }
}
