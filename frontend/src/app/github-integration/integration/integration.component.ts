import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../../services/github/github.service';
import { GithubDetails } from '../../interfaces/githubDetails';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
})
export class IntegrationComponent implements OnInit, OnDestroy {
  connected = false;
  accessToken: string | null = null;
  isLoading = true;

  userDetails: GithubDetails | null = null;
  ngUnsubscribe = new Subject<void>();

  constructor(private githubService: GithubService, private router: Router) {}

  ngOnInit() {
    this.checkConnection();
    this.handleGithubRedirect();
  }

  private checkConnection() {
    this.isLoading = true;
    const storedData = localStorage.getItem('token');

    if (storedData) {
      this.githubService.getUserDetails().subscribe(
        (response) => {
          console.log('Details:', response);
          this.userDetails = response.user;
          this.connected = true;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  connect() {
    this.githubService.redirectToGithub();
  }

  private handleGithubRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      this.isLoading = true;
      this.githubService
        .getAccessToken(code)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (response) => {
            console.log('Access Token:', response.accessToken);
            this.accessToken = response.token;
            this.connected = true;
            localStorage.setItem('token', response.token);

            this.isLoading = false;
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error getting access token:', error);
          }
        );
    }
  }

  disconnect() {
    this.githubService
      .disconnectFromGithub()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.accessToken = null;
          this.connected = false;
          localStorage.removeItem('token');
        },
        (error) => {
          console.error('Error disconnecting:', error);
          alert('There was an error disconnecting.');
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
