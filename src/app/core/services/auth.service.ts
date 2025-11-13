import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { consts } from '../environments/consts';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
interface JwtPayload {
  id: string; 
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
 headers = new HttpHeaders().set('token', localStorage.getItem('userToken'));

  setRegister(data:object): Observable<any>
  {
    return this._httpClient.post(`${consts.baseUrl}/api/v1/auth/signup`,data);
  }
    setLogin(data:object): Observable<any>
  {
    return this._httpClient.post(`${consts.baseUrl}/api/v1/auth/signin`,data);
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
    return this.userPayload.id;
  }
  Logout():void{
    this.userPayload=null!;
    localStorage.removeItem('userToken');
    this._router.navigate(['/login']); 
  }
   forgotPassword(data: any): Observable<any> {
    return this._httpClient.post(`${consts.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  verifyResetCode(data: any): Observable<any> {
    return this._httpClient.post(`${consts.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

 resetPassword(data: any): Observable<any> {
    return this._httpClient.put(`${consts.baseUrl}/api/v1/auth/resetPassword`, data);
  }

  verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this._httpClient.get(`${consts.baseUrl}/api/v1/auth/verifyToken`, { headers });
  }

  changePassword(data: any): Observable<any> {
    const headers = new HttpHeaders().set('token', localStorage.getItem('userToken'));
    return this._httpClient.put(`${consts.baseUrl}/api/v1/users/changeMyPassword`, data, { headers });
  }

  updateUser(data: any): Observable<any> {
    return this._httpClient.put(`${consts.baseUrl}/api/v1/users/updateMe`, data, { headers: this.headers });
  }

  getAllUsers(): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/users`,{headers:this.headers});
  }
  getUser(id:string): Observable<any> {
    return this._httpClient.get(`${consts.baseUrl}/api/v1/users/${id}`,{headers:this.headers});
  }
}
  

