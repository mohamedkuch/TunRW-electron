import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Member } from '../admin-members/member.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthDataCreate } from './create-user.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/user";
@Injectable({providedIn: 'root'})
export class AuthService {
  private tokenTimer;
  private currentuser: Member;
  private Members: Member[] = [];
  private memberUpdated = new Subject<{Members: Member[] , postCount: number}>();
  constructor(private http: HttpClient,
              private router: Router ) {}

  getcurrentUser() {
    return this.currentuser;
  }
  getUser(id: string) {
    return this.http.get<{_id: string;
      username: string;
       name: string;
      }>(BACKEND_URL + "/" + id);
  }

  getMemberUpdateListener() {
    return this.memberUpdated.asObservable();
  }

  getAllMembers(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{users: any, maxPosts: number}>(BACKEND_URL+ queryParams)
      .pipe(map((data) => {
          return {
            users : data.users.map(post => {
              return {
                id : post._id,
                name : post.name,
                username : post.username
              };
            }) ,
            maxPosts : data.maxPosts
        };
      }))
      .subscribe((finalData) => {
            console.log(finalData);
            this.Members = finalData.users;
            this.memberUpdated.next({Members: [...this.Members] , postCount : finalData.maxPosts});
      });
  }
  getToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser){
      return;
    }
    const token = currentUser.token;
    return token;

  }
  getTokenExpirationDate() {
    const tmp = JSON.parse(localStorage.getItem('expiration'));
    if  (!tmp) {
      return;
    }
    const finalDate = Math.floor( ( new Date(tmp.value).getTime() - new Date().getTime() ) / 60000 );
    return finalDate;
  }
  getAuthStatus() {
    const tmp = JSON.parse(localStorage.getItem('isLogged'));
    if ( tmp ) {
      return true;
    } else {
      return false;
    }
  }
  private getAuthData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLogged = localStorage.getItem('isLogged');
    const expirationDate = JSON.parse(localStorage.getItem('expiration'));
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    if (!currentUser  ) {
      return;
    }
    return {
      token: currentUser.token,
      expirationDate : new Date(expirationDate.value),
      isLogged : isLogged,
      userId: userId,
      username: username,
      name: name
    }
  }
  autoAuthUser() {
    if (this.getAuthStatus()) {
      const authInformation = this.getAuthData();
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      this.currentuser = {username: authInformation.username,
        id: authInformation.userId, name: authInformation.name};
      if (expiresIn < 0){
        this.clearAuthData();
      }
    }


  }

  createUser(username: string, password: string,  name: string) {
    const authData: AuthDataCreate = {username: username, password: password, name: name};
    return this.http.post(BACKEND_URL + '/signup', authData);
  }
  loginUser(username: string, password: string ) {
    const authData: AuthData = {username: username, password: password};
    this.http
      .post<{token: string, expiresIn: number, username: string, id: string, name: string}>(BACKEND_URL + '/login',
       authData).subscribe(response => {
        this.saveAuthData(response);
        this.router.navigate(['/admin']);
      });

  }
  private setAuthTimer(duration: number) {
    console.log('Setting Timer : ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    },  duration * 1000);
  }
  private saveAuthData(data){
    this.setAuthTimer(data.expiresIn);
    localStorage.setItem('currentUser', JSON.stringify({ token: data.token }));
    const now = new Date();
    const expirationDate = new Date( now.getTime() + data.expiresIn * 1000);
    localStorage.setItem('expiration', JSON.stringify({ value: expirationDate }));
    localStorage.setItem('userId', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('name', data.name);
    localStorage.setItem('isLogged', 'true');
    this.currentuser = {username: data.username, id: data.id, name:data.name};
    console.log('Logging with user ',  data);
  }
  private clearAuthData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expiration');
    localStorage.removeItem('isLogged');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
  }

  logout() {
    this.clearAuthData();
    this.router.navigate(['/login']);
    clearTimeout(this.tokenTimer);
    this.createUser = null;
  }
}
