import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SpinnerOverlayModule } from 'module/spinner-overlay/spinner-overlay.module';
import { GeneralState } from '../../../../module/store/general.state';

import { environment } from 'environments/environment';
import { NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NavigationService } from '@services/navigation.service';
import { APP_INITIALIZER_PROVIDERS } from '@services/app.initializer.service';
import { AuthTokenInterceptor } from '@services/interceptors/auth-token.interceptor';
import { QuoteProgessState } from './store/states/quote-progress.state';
import { UserInputState } from './store/states/user-input.state';
import { MainLayoutComponent } from './module/main-layout/main-layout.component';
import { MainLayoutModule } from './module/main-layout/main-layout.module';
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
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled' }),
    BrowserAnimationsModule,
    MainLayoutModule,
    NxNativeDateModule,
    HttpClientModule,
    FormsModule,
    SpinnerOverlayModule,
    NxModalModule,
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
