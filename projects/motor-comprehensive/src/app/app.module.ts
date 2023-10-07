import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../../../layout/main-layout/main-layout.component';
import { MainLayoutModule } from '../../../../layout/main-layout/main-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { SpinnerOverlayModule } from 'module/spinner-overlay/spinner-overlay.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { APP_INITIALIZER_PROVIDERS } from '@services/app.initializer.service';
import { AuthTokenInterceptor } from '@services/interceptors/auth-token.interceptor';
import { environment } from 'environments/environment';
import { NgxsModule } from '@ngxs/store';

import { GeneralState } from 'module/store/general.state';
import { NavigationService } from '@services/navigation.service';
import { QuoteProgessState } from '../app/store/states/quote-progress.state';
import { UserInputState } from './store/states/user-input.state';
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
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
    }),
    MainLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GoogleMapsModule,
    SpinnerOverlayModule,
    ServerTimeoutDialogModule,
    NgxsModule.forRoot([GeneralState, QuoteProgessState, UserInputState], {
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
    NavigationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
