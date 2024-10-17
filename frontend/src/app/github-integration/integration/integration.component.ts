import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../../services/github/github.service';
import { GithubDetails } from '../../interfaces/githubDetails';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ColDef,
  DomLayoutType,
  GridReadyEvent,
  IServerSideDatasource,
  RowModelType,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { CheckboxComponent } from 'src/app/shared/checkbox.component';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
})
export class IntegrationComponent implements OnInit, OnDestroy {
  rowData = [];
  userRowData = [];
  public context: any = {
    onIncludeRepo: this.onIncludeRepo.bind(this),
  };

  domLayout: DomLayoutType = 'autoHeight';

  colDefs: ColDef[] = [
    { field: 'ID' },
    { field: 'Name' },
    { field: 'Link' },
    { field: 'Slug' },
    {
      field: 'Included',
      editable: true,
      cellRenderer: CheckboxComponent,
    },
  ];
  userColDefs: ColDef[] = [
    { field: 'userId', headerName: 'UserID' },
    { field: 'name', headerName: 'User' },
    { field: 'total_commits', headerName: 'Total Commits' },
    { field: 'total_pulls', headerName: 'Total Pull Requests' },
    { field: 'total_issues', headerName: 'Total Issues' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 90,
  };
  rowModelType: RowModelType = 'serverSide';
  cacheBlockSize = 10;
  themeClass: string = 'ag-theme-quartz';

  connected = false;
  accessToken: string | null = null;
  isLoading = true;

  userDetails: GithubDetails | null = null;
  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 20, 50, 100];
  repos: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalRepos: number = 0;
  ngUnsubscribe = new Subject<void>();

  constructor(private githubService: GithubService, private router: Router) {}

  onGridReadyRepo(params: GridReadyEvent) {
    let datasource = this.getServerSideDatasourceRepos();

    params.api!.setGridOption('serverSideDatasource', datasource);
  }
  onGridReadyUser(params: GridReadyEvent) {
    let datasource = this.getServerSideDatasourceUsers();

    params.api!.setGridOption('serverSideDatasource', datasource);
  }

  onIncludeRepo(data: any, checked: any) {
    if (checked) {
      this.githubService.includeUser(data.ID).subscribe();
    } else {
      this.githubService.excludeUser(data.ID).subscribe();
    }
  }

  ngOnInit() {
    this.checkConnection();
    this.handleGithubRedirect();
  }

  getServerSideDatasourceRepos(): IServerSideDatasource {
    return {
      getRows: (params) => {
        const startIndex =
          Math.ceil((params?.request?.startRow || 0) / this.pageSize) + 1;
        this.githubService
          .getOrganizationRepos(startIndex, this.pageSize)
          .subscribe(
            (response) => {
              const { repositories = [], totalRepositories = 0 } =
                response.data;
              if (!repositories.length && !totalRepositories) {
                params.api.showNoRowsOverlay();
                params.success({ rowData: [], rowCount: 0 });
                return;
              }

              params.api.hideOverlay();

              const mappedData = repositories.map((repo: any) => {
                return {
                  ID: repo.id,
                  Name: repo.name,
                  Link: repo.url,
                  Slug: repo.full_name,
                  Included: false,
                };
              });

              params.success({
                rowData: mappedData,
                rowCount: totalRepositories,
              });
            },
            () => {
              params.fail();
            }
          );
      },
    };
  }

  getServerSideDatasourceUsers(): IServerSideDatasource {
    return {
      getRows: (params) => {
        const startIndex =
          Math.ceil((params?.request?.startRow || 0) / this.pageSize) + 1;
        this.githubService.getUsersList(startIndex, this.pageSize).subscribe(
          (response) => {
            const { users = [], totalUsers = 0 } = response.data;
            if (!users.length && !totalUsers) {
              params.api.showNoRowsOverlay();
              params.success({ rowData: [], rowCount: 0 });
              return;
            }

            params.api.hideOverlay();

            const mappedData = users.map((user: any) => {
              return {
                userId: user.id,
                name: user.name,
                total_commits: user.total_commits,
                total_pulls: user.total_pulls,
                total_issues: user.total_issues,
              };
            });

            // this.userRowData = mappedData;
            params.success({
              rowData: mappedData,
              rowCount: totalUsers,
            });
          },
          () => {
            params.fail();
          }
        );
      },
    };
  }

  private checkConnection() {
    this.isLoading = true;
    const storedData = localStorage.getItem('token');
    if (storedData) {
      this.githubService.getUserDetails().subscribe(
        (response) => {
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
