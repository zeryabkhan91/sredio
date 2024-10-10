import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private clientId = 'dbc703768e38fbd9aed8';
  private redirectUri = 'http://localhost:4200/auth';

  constructor(private http: HttpClient) {}

  redirectToGithub() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
    window.location.href = authUrl;
  }

  getAccessToken(code: string): Observable<any> {
    return this.http.post('http://localhost:3001/api/auth/github', { code });
  }

  getUserDetails(): Observable<any> {
    return this.http.get('http://localhost:3001/api/user/details');
  }

  disconnectFromGithub(): Observable<any> {
    return this.http.post(
      'http://localhost:3001/api/auth/github/disconnect',
      {}
    );
  }
}
