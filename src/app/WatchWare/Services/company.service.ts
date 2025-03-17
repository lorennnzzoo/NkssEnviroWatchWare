import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Company, CompanyCreation, CompanyEdit } from '../Interfaces/Company';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl: string = environment.apiUrl + 'Company';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }



  GetAllCompanies(): Observable<Company[]> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<Company[]>();  // Return an empty observable to prevent further actions
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get<Company[]>(`${this.apiUrl}/GetAllCompanies`, { headers });
  }


  CreateCompany(company: CompanyCreation): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('ShortName', company.ShortName)
      .set('LegalName', company.LegalName)
      .set('Country', company.Country)
      .set('State', company.State)
      .set('District', company.District)
      .set('Address', company.Address)
      .set('PinCode', company.PinCode)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.apiUrl}/AddCompany`, params, { headers });
  }


  DeleteCompany(company: Company): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', company.Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete(`${this.apiUrl}/DeleteCompany`, { headers, params });
  }

  GetCompanyById(Id: number): Observable<Company> {
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
    return this.http.get<Company>(`${this.apiUrl}/GetCompany`, { headers, params });
  }

  EditCompany(company: CompanyEdit): Observable<any> {
    const token = this.authService.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/Login']);
      return new Observable<any>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', company.Id)
      .set('ShortName', company.ShortName)
      .set('LegalName', company.LegalName)
      .set('Country', company.Country)
      .set('State', company.State)
      .set('District', company.District)
      .set('Address', company.Address)
      .set('PinCode', company.PinCode)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.put(`${this.apiUrl}/UpdateCompany`, params, { headers });
  }
}

