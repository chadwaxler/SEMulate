import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinescanDataService {
  private _detections = new BehaviorSubject<number[]>([]);
  public detections$ = this._detections.asObservable();

  public updateData(data: number[]) {
    this._detections.next(data);
  }
}
