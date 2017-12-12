import { Router, NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';

declare let childApp: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {
    this.initChildRouter();
  }

  // Sync Subroutes
  initChildRouter() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      childApp.sendRoute(e.url);
    });

    childApp.registerForRouteChange(url => this.router.navigateByUrl(url));
  }

}
