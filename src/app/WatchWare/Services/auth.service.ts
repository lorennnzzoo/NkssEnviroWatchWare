import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Role } from '../Interfaces/Role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.apiUrl + 'Auth';

  // Reactive state management
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private usernameSubject = new BehaviorSubject<string | null>(this.getUsername());
  private roleSubject = new BehaviorSubject<string | null>(this.getRole());

  // Public observables for components to subscribe to
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  register(
    Username: string,
    Password: string,
    Email: string,
    PhoneNumber: string,
    Role: number
  ): Observable<any> {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      const body = new HttpParams()
        .set('Username', Username)
        .set('Password', Password)
        .set('Email', Email)
        .set('PhoneNumber', PhoneNumber)
        .set('RoleId', Role.toString());

      return this.http.post(`${this.apiUrl}/Register`, body, { headers });
    } else {
      this.router.navigate(['/login']);
      return new Observable<any>();
    }
  }

  login(username: string, password: string, grant_type: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', grant_type);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<any>(`${this.apiUrl}/Login`, body, { headers }).pipe(
      switchMap((response) => {
        if (response && response.access_token) {
          this.setToken(response.access_token);
          return of(response);
        }
        return of({ error: 'Invalid credentials' });
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of({ error: 'Login failed', details: error });
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);

    // Fetch and update user role and username
    this.getUserRole().pipe(
      tap((roleResponse) => {
        if (roleResponse) {
          this.roleSubject.next(roleResponse.Role || '');  // Notify role update
          localStorage.setItem('Role', roleResponse.Role || '');
        }
      }),
      catchError((error) => {
        console.error('Error fetching role', error);
        return of(null);  // Continue execution even if there's an error
      })
    ).subscribe();

    this.getUserName().pipe(
      tap((usernameResponse) => {
        if (usernameResponse) {
          this.usernameSubject.next(usernameResponse.Username || '');  // Notify username update
          localStorage.setItem('Username', usernameResponse.Username || '');
        }
      }),
      catchError((error) => {
        console.error('Error fetching username', error);
        return of(null);  // Continue execution even if there's an error
      })
    ).subscribe();

    this.isAuthenticatedSubject.next(true);  // Notify authenticated state
  }


  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('Role');
    localStorage.removeItem('Username');
    this.isAuthenticatedSubject.next(false);
    this.roleSubject.next(null);
    this.usernameSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return localStorage.getItem('Role');
  }

  getUsername(): string | null {
    return localStorage.getItem('Username');
  }

  getToken(): string | null {
    let token = localStorage.getItem('authToken');
    if (token) {
      // if (this.validateToken(token)) {
      return token;
      // }
      // else {
      //   localStorage.removeItem('authToken');
      //   return null;
      // }
    }
    else {
      return null;
    }
  }

  getUserRole(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<any>(`${this.apiUrl}/GetUserRole`, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching user role', error);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return of(null);
    }
  }

  getUserName(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<any>(`${this.apiUrl}/GetUsername`, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching username', error);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/login']);
      return of(null);
    }
  }

  loadRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetRoles`).pipe(
      catchError((error) => {
        console.error('Error loading roles', error);
        return of({ error: 'Error loading roles', details: error });
      })
    );
  }

  validateToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/ValidateToken`, { headers, observe: 'response' }).pipe(
      switchMap((response) => {
        if (response.status === 200) {
          return of(true); // Token is valid, return true
        } else {
          return of(false); // Token is invalid, return false
        }
      }),
      catchError(() => of(false)) // If the request fails (e.g., 401), return false
    );
  }


  GetRoleById(Id: number): Observable<Role> {
    const token = this.getToken();  // Replace with your token fetching logic
    if (!token) {
      // Redirect to login if no token exists
      this.router.navigate(['/login']);
      return new Observable<Role>();  // Return an empty observable to prevent further actions
    }
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set('Id', Id)
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<Role>(`${this.apiUrl}/GetRole`, { headers, params });
  }
}
