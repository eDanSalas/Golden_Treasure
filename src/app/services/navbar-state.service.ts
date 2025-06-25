import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavbarStateService {
  private navbarRefreshSubject = new Subject<void>();

  navbarRefresh$ = this.navbarRefreshSubject.asObservable();

  requestRefresh() {
    this.navbarRefreshSubject.next();
  }
}