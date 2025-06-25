import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
}).catch((err) => console.error(err));
