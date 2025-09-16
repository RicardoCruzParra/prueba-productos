import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'http://localhost:8080/api/auth';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.api}/login`, { username, password }).pipe(
      tap(res => localStorage.setItem('token', res.token)),
      map(() => true)
    );
  }
  logout(): void { localStorage.removeItem('token'); }
  isLogged(): boolean { return !!localStorage.getItem('token'); }
}
