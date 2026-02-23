import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExitRequestService {
  private exitRequestSource = new Subject<{windowId : string, callback :() => void}>();
  exitRequested$ = this.exitRequestSource.asObservable();

  
  requestExit(windowId : string, callback: ()=> void) {
    this.exitRequestSource.next({windowId, callback});
  }
}
