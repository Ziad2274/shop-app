import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { consts } from '../environments/consts';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IProfile } from '../interfaces/iproduct';

interface JwtPayload {
  id: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly _httpClient=inject(HttpClient);
private readonly _router=inject(Router);
userToken:string='';
userPayload: JwtPayload | null = null;
userId:string;

get headers(): HttpHeaders {
  return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('userToken')}`);
}

  setRegister(data:any): Observable<any>
  {
    // The register form only collects a single "name" field + a rePassword
    // confirmation, but zizo-shop's /api/auth/register expects
    // { FirstName, LastName, Email, Phone, Password } and has no rePassword field.
    const [firstName, ...rest] = (data.name ?? '').trim().split(' ');
    const payload = {
      FirstName: firstName || data.name,
      LastName: rest.join(' ') || firstName || data.name,
      Email: data.email,
      Phone: data.phone,
      Password: data.password,
    };
    return this._httpClient.post(`${consts.baseUrl}/api/auth/register`, payload);
  }

  // Login now returns { token, refreshToken } directly. Both get stored so
  // refreshToken() can silently renew the session once the access token expires.
  setLogin(data:object): Observable<AuthResponse>
  {
    return this._httpClient.post<AuthResponse>(`${consts.baseUrl}/api/auth/login`,data).pipe(
      tap(res => this.storeTokens(res))
    );
  }

  storeTokens(res: AuthResponse): void {
    localStorage.setItem('userToken', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    this.saveUserToken();
  }

  // Exchanges the stored refresh token for a new token pair. Used by the
  // HTTP interceptor when a request comes back 401.
  refreshToken(): Observable<AuthResponse> {
    const token = localStorage.getItem('refreshToken');
    return this._httpClient.post<AuthResponse>(`${consts.baseUrl}/api/auth/refresh`, { token }).pipe(
      tap(res => this.storeTokens(res))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this._httpClient.post(
      `${consts.baseUrl}/api/auth/change-password`,
      { currentPassword, newPassword },
      { headers: this.headers }
    );
  }

  saveUserToken():void{
    const token=localStorage.getItem('userToken');
    if(token!==null){
      try {
        this.userPayload=jwtDecode<JwtPayload>(token);
      } catch (error) {
       console.error('Failed to decode stored JWT token:', error);
        this.userPayload = null;
        localStorage.removeItem('userToken');
      }
      this.userToken= jwtDecode(localStorage.getItem('userToken')!);
  }
  else {
      this.userPayload = null;
    }
}

  getUserId():string|null{
    if (!this.userPayload) {
      this.saveUserToken();
    }
    return this.userPayload?.id ?? null;
  }

  Logout():void{
    this.userPayload=null!;
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    this._router.navigate(['/login']);
  }

  // Backed by AuthController's [Authorize] GET /api/auth/profile.
  getProfile(): Observable<IProfile> {
    return this._httpClient.get<any>(`${consts.baseUrl}/api/auth/profile`, { headers: this.headers }).pipe(
      map(dto => ({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
      }))
    );
  }

  // NOTE: forgot-password / reset-password / verify-code have no matching
  // backend endpoints, so those flows/components were removed from the app.
  // Admin-only endpoints (GET /api/auth/users, PATCH .../role) aren't wired
  // up either since there's no admin UI yet — say the word if you want one.
}
