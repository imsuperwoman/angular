import {
  APP_INITIALIZER,
  Injectable,
  INJECTOR,
  inject,
  Provider
} from '@angular/core';
import { environment } from 'environments/environment';
import { APP_BASE_CONFIG, BASE_CONFIG } from './interceptors/auth-token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AppIntializerService {
  public config!: APP_BASE_CONFIG | null;
  constructor() {
    this.config = null;
  }

  public baseUrl() {
    console.log('====== ' + window.location.hostname + ' ====== ');
    var API_URL = 'https://asia-dev-ext-malaysia.apis.allianz.com/';
    var API_TOKEN = environment.API_TOKEN;

    //var API_URL = 'https://apiuat.allianz.com.my/';
    //var API_TOKEN = 'ZnN5cWhQR2JBRzBTR3pselljQlQ3QVZzc1Fqcm1RSHY6ZHZJY3RHclNoTXFJQXVDbw'

    //var API_URL = 'https://asia-uat-malaysia.apis.allianz.com/';
    //var API_TOKEN = 'bDZmZGdJQVdOdkFiNGdqcndkZHRXQWpFdHNPTUFHalQ6Z0tyd1g3NGl1dm5lUHUwdg'

    //var API_URL ='https://api.allianz.com.my/';
    //var API_TOKEN ='OE9mc2JmaW1DdEtyTFo0dHR2eFZzWFFWdWY4Rm1UdEw6U3FIRUJFdEFjcERqdXcwOQ=='

    switch (window.location.hostname) {
      case 'getquotedev.allianz.com.my':
        API_URL = 'https://asia-dev-ext-malaysia.apis.allianz.com/';
        break;
      case 'getquote.allianz.com.my':
        API_URL = 'https://api.allianz.com.my/';
        break;
      case 'getquoteuat.allianz.com.my':
        API_URL = 'https://asia-uat-malaysia.apis.allianz.com/';
        break;
      case 'getquotedr.allianz.com.my':
        API_URL = 'https://apidr.allianz.com.my/';
        break;
    }
    return (this.config = {
      API_URL: API_URL,
      API_TOKEN: API_TOKEN,
    });
  }
}

export var APP_INITIALIZER_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: function (appIntializerService: AppIntializerService) {
      return function () {
        return appIntializerService.baseUrl();
      };
    },
    deps: [AppIntializerService],
    multi: true,
  },
  {
    provide: BASE_CONFIG,
    useFactory: () => {
      return inject(INJECTOR).get(AppIntializerService).baseUrl();
    },
    deps: [AppIntializerService],
  },
];
