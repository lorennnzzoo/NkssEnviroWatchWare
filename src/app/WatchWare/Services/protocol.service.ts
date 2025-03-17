import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Analyzer, AnalyzerCreation, AnalyzerEdit } from '../Interfaces/Protocol';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  private apiUrl: string = environment.apiUrl + 'Analyzer';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  GetAllProtocols(): Observable<Analyzer[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<Analyzer[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Analyzer[]>(`${this.apiUrl}/GetAllAnalyzers`, { headers });
  }

  GetProtocolById(Id: number): Observable<Analyzer> {
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
    return this.http.get<Analyzer>(`${this.apiUrl}/GetAnalyzer`, { headers, params });
  }

  CreateProtocol(Analyzer: AnalyzerCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('ProtocolType', Analyzer.ProtocolType)
      .set('CommunicationType', Analyzer.CommunicationType)
      .set('Command', Analyzer.Command)
      .set('ComPort', Analyzer.ComPort)
      .set('BaudRate', Analyzer.BaudRate)
      .set('Parity', Analyzer.Parity)
      .set('DataBits', Analyzer.DataBits)
      .set('StopBits', Analyzer.StopBits)
      .set('IpAddress', Analyzer.IpAddress)
      .set('Port', Analyzer.Port)
      .set('Manufacturer', Analyzer.Manufacturer)
      .set('Model', Analyzer.Model);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddAnalyzer`, params, { headers });
  }


  EditProtocol(Analyzer: AnalyzerEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Analyzer.Id)
      .set('ProtocolType', Analyzer.ProtocolType)
      .set('CommunicationType', Analyzer.CommunicationType)
      .set('Command', Analyzer.Command)
      .set('ComPort', Analyzer.ComPort)
      .set('BaudRate', Analyzer.BaudRate)
      .set('Parity', Analyzer.Parity)
      .set('DataBits', Analyzer.DataBits)
      .set('StopBits', Analyzer.StopBits)
      .set('IpAddress', Analyzer.IpAddress)
      .set('Port', Analyzer.Port)
      .set('Manufacturer', Analyzer.Manufacturer)
      .set('Model', Analyzer.Model);
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateAnalyzer`, params, { headers });
  }


  DeleteProtocol(Analyzer:Analyzer):Observable<any>{
        const token = this.authService.getToken();  // Replace with your token fetching logic
        if (!token) {
          // Redirect to login if no token exists
          this.router.navigate(['/Login']);
          return new Observable<any>();  // Return an empty observable to prevent further actions
        }
        let headers = new HttpHeaders();
        let params = new HttpParams()
          .set('Id', Analyzer.Id)
        headers = headers.set('Authorization', 'Bearer ' + token);
        return this.http.delete(`${this.apiUrl}/DeleteAnalyzer`, { headers, params });
      }
}
