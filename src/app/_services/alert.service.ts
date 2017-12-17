import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false, timeout = 0) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
    console.log('jjjjj');
    if (timeout > 0) {
      // clear message
      setTimeout(() => this.subject.next(), timeout);
    }
  }

  error(message: string, keepAfterNavigationChange = false, timeout = 0) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
    console.log('in Error');
    if (timeout > 0) {
      // clear message
      setTimeout(() => this.subject.next(), timeout);
    }
  }

  getMessage(): Observable<any> {
    console.log('got it now');
    return this.subject.asObservable();
  }
}
