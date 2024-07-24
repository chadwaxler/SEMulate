import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LinescanDataService {
  private _detections = new BehaviorSubject<number[]>([]);
  public detections$ = this._detections.asObservable();

  private _http = inject(HttpClient);

  public updateData(data: number[]) {
    this._detections.next(data);
  }

  public fetchData() {
    const params = new HttpParams()
      .append('numLines', '3')
      .append('scanWidth', '800')
      .append('numberOfElectrons', '1000');

    this._http
      .get<number[]>('http://localhost:5012/Semulate?', { params })
      .subscribe((data) => this.updateData(data));
  }
}
