import { Component, inject } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import { LinescanDataService } from '../../services/linescan-data.service';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'sem-linescan',
  standalone: true,
  imports: [HighchartsChartModule, AsyncPipe, NgIf, JsonPipe],
  templateUrl: './linescan.component.html',
  styleUrl: './linescan.component.scss',
})
export class LinescanComponent {
  Highcharts: typeof Highcharts = Highcharts; // required

  private _chartRef: Chart | undefined;
  private _linescanData = inject(LinescanDataService);

  public updateFlag = false;

  protected _options$: Observable<Highcharts.Options> =
    this._linescanData.detections$.pipe(
      map((data) => {
        const options: Highcharts.Options = {
          chart: {
            animation: false,
            spacingTop: 0,
            spacingRight: 0,
            spacingBottom: 0,
            spacingLeft: 0,
          },
          credits: {
            enabled: false,
          },
          title: {
            text: undefined,
          },
          yAxis: {
            labels: {
              enabled: false,
            },
            title: {
              text: undefined,
            },
          },
          xAxis: {
            labels: {
              enabled: false,
            },
            title: {
              text: undefined,
            },
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              data: [...data],
              type: 'line',
            },
          ],
        };

        return options;
      }),
      // tap((options) => (this.updateFlag = true)),
    );

  public setChartRef(chart: Chart) {
    this._chartRef = chart;
  }
}
