import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { SelectionModel } from '../Interfaces/ReportSelection';
import { Observable } from 'rxjs';
import { ChannelDataResult } from '../Interfaces/ChannelDataResult';
import { ReportFilter } from '../Interfaces/ReportSubmitFilter';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl: string = environment.apiUrl + 'Report';
    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  
    GetSelectionModel(): Observable<SelectionModel> {
      const token = this.authService.getToken();  // Replace with your token fetching logic
      if (!token) {
        // Redirect to login if no token exists
        this.router.navigate(['/Login']);
        return new Observable<SelectionModel>();  // Return an empty observable to prevent further actions
      }
  
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + token);
  
      return this.http.get<SelectionModel>(`${this.apiUrl}/GetSelectionData`, { headers });
    }
  

    GetDataReport(Filter:ReportFilter):Observable<any[]>{      
      const token = this.authService.getToken();  // Replace with your token fetching logic
      if (!token) {
        // Redirect to login if no token exists
        this.router.navigate(['/Login']);
        return new Observable<any[]>();  // Return an empty observable to prevent further actions
      }
  
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + token);
      let params=new HttpParams();
      params=params.set('companyId', Filter.companyId ? Filter.companyId.toString() : '')
      .set('stationsId', Filter.stationsId.join(','))
      .set('channelsId', Filter.channelsId.join(','))
      .set('dataAggregationType', Filter.dataAggregationType.toString())
      .set('from', Filter.from ? Filter.from.toISOString() : '')
      .set('to', Filter.to ? Filter.to.toISOString() : '')
      .set('ReportType',Filter.reportType.toString());
  
      return this.http.post<any[]>(`${this.apiUrl}/GetReport`, params,{ headers });
    }
}
