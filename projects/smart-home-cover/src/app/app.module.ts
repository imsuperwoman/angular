import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainLayoutComponent } from '../../../../layout/main-layout/main-layout.component';
import { MainLayoutModule } from '../../../../layout/main-layout/main-layout.module';
import { SpinnerOverlayModule } from 'module/spinner-overlay/spinner-overlay.module';
import { GeneralState } from '../../../../module/store/general.state';

import { environment } from 'environments/environment';
import { NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NgxsModule } from '@ngxs/store';
import { UserInputState, QuoteProgessState } from './store/states';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { QuoteProgessService } from './services/quote-progress.service';
import { NavigationService } from '@services/navigation.service';
import { APP_INITIALIZER_PROVIDERS } from '@services/app.initializer.service';
import { AuthTokenInterceptor } from '@services/interceptors/auth-token.interceptor';
import { ServerTimeoutDialogModule } from 'module/server-timeout-dialog/server-timeout-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then((mod) => mod.HomeModule),
      },
    ],
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled' }),
    MainLayoutModule,
    BrowserAnimationsModule,
    NxNativeDateModule,
    GoogleMapsModule,
    HttpClientModule,
    FormsModule,
    SpinnerOverlayModule,
    NxModalModule,
    ServerTimeoutDialogModule,
    NgxsModule.forRoot([UserInputState, GeneralState, QuoteProgessState], {
      developmentMode: !environment.production
    }),
    NgxsStoragePluginModule.forRoot({
      storage: 1,
    }),
    NgxsLoggerPluginModule.forRoot({ logger: console, collapsed: false, disabled: environment.production }),
  ],
  providers: [
    APP_INITIALIZER_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    QuoteProgessService,
    NavigationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
