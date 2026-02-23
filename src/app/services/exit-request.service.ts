import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ExitRequestService {
  private exitRequestSource = new Subject<() => void>();
  exitRequested$ = this.exitRequestSource.asObservable();

  
  requestExit(callback: ()=> void) {
    this.exitRequestSource.next(callback);
  }
}
