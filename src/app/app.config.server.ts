import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { appConfig } from './app.config';
import { authInterceptor } from './interceptors/auth-interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);