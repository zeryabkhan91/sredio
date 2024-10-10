import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router'; 
import { IntegrationComponent } from './github-integration/integration/integration.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptor/auth.Interceptor';
import { DateTransform } from './date-transform.pipe';

@NgModule({
  declarations: [
    AppComponent,
    IntegrationComponent,
    DateTransform,
  ],
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    RouterModule.forRoot([]) 
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true }],
  bootstrap: [AppComponent]
})



export class AppModule { }
