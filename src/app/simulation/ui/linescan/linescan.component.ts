import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
} from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { DetectionsStore } from '@stores/detections.store';
import { DEFAULT_OPTIONS } from './chart-options';

@Component({
  selector: 'sem-linescan',
  imports: [HighchartsChartModule],
  templateUrl: './linescan.component.html',
  styleUrl: './linescan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinescanComponent {
  Highcharts: typeof Highcharts = Highcharts; // required for Highcharts
  private _detections = inject(DetectionsStore);
  public options: Signal<Highcharts.Options> = computed(() => {
    return {
      ...DEFAULT_OPTIONS,
      series: [{ type: 'line', data: [...this._detections.detections()] }],
    };
  });
}
