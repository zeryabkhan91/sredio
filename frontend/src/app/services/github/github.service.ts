import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment.development';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private apiUrl: string = (environment as any).apiUrl;
  private clientId: string = (environment as any).githubClientID;
  private redirectUri = `${window.location.origin}/auth`;

  constructor(private http: HttpClient) {}

  redirectToGithub() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    window.location.href = authUrl;
  }

  getAccessToken(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/github`, { code });
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/details`);
  }

  disconnectFromGithub(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/github/disconnect`,
      {}
    );
  }
}
