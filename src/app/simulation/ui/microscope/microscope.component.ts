import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { OptionsStore } from '@stores/options.store';
import p5 from 'p5';
import { Scanner } from './scanner';
import { GeometryLines } from './line-geometry';
import { debounceTime, fromEvent, tap } from 'rxjs';
import { InteractionVolume } from './interaction-volume';
import { DetectionsStore } from '@stores/detections.store';

@Component({
  selector: 'sem-microscope',
  imports: [],
  templateUrl: './microscope.component.html',
  styleUrl: './microscope.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroscopeComponent implements OnInit, AfterViewInit {
  private _p5!: p5;
  private readonly _optionsStore = inject(OptionsStore);
  private readonly _detectionStore = inject(DetectionsStore);
  private readonly _sketch = viewChild<ElementRef>('sketch');
  private readonly _sketchContainer = viewChild<ElementRef>('sketchContainer');
  private readonly _width = signal(600);
  private readonly _onResize = fromEvent(window, 'resize').pipe(
    debounceTime(100),
    tap(() =>
      this._width.set(this._sketchContainer()?.nativeElement.offsetWidth),
    ),
    tap(() => this._redraw()),
  );

  public ngOnInit(): void {
    this._onResize.subscribe();
  }

  public ngAfterViewInit(): void {
    this._width.set(this._sketchContainer()?.nativeElement.offsetWidth);
    this._draw();
  }

  private _draw(): void {
    this._p5 = new p5((p: p5) => {
      const width = this._width();
      const height = 300;

      const scanner = new Scanner(p, width);
      const lineGeometry = new GeometryLines(p, width, height);
      lineGeometry.numLines = 3;

      // SETUP Lifecycle
      p.setup = () => {
        p.createCanvas(width, height);
      };

      p.draw = () => {
        p.background(220);
        p.stroke(0);

        lineGeometry.numLines = this._optionsStore.numLines();
        lineGeometry.draw();

        const yGeometry = lineGeometry.getYGeometry(scanner.xPosition);
        const interactionVolume = new InteractionVolume(
          p,
          scanner.xPosition,
          yGeometry,
          this._optionsStore.ivDepth(),
          this._optionsStore.ivRadius(),
        );
        interactionVolume.draw();
        scanner.draw();

        let escapedElectrons = 0;
        for (let i = 0; i < this._optionsStore.electronsPerFrame(); i++) {
          const [x, y] = interactionVolume.randomPoint;

          if (lineGeometry.isPointInMaterial(x, y)) {
            p.circle(x, y, 3);

            // Generate a random direction and magnitude for the line
            let lineAngle = p.random(p.TWO_PI);
            const mean = this._optionsStore.energyMean();
            let lineLength = p.randomGaussian(mean, 20); // You can adjust the range of the line length

            // Calculate the end point of the line
            let xEnd = x + lineLength * p.cos(lineAngle);
            let yEnd = y + lineLength * p.sin(lineAngle);

            if (!lineGeometry.isPointInMaterial(xEnd, yEnd)) {
              escapedElectrons++;

              // Draw the point and the line
              p.stroke(42, 252, 42, 50);
              p.noStroke();
              p.ellipse(x, y, 2, 2);

              p.stroke(42, 252, 42, 50);
              p.line(x, y, xEnd, yEnd);
            } else {
              // If the line is still in the material, draw it in red
              p.stroke(252, 42, 42, 5);
              p.line(x, y, xEnd, yEnd);
            }
          }
        }

        scanner.setDetectionCount(scanner.xPosition, escapedElectrons);
        scanner.increment();
        this._detectionStore.updateValues(scanner.detections);
      };
    }, this._sketch()?.nativeElement);
  }

  private _redraw(): void {
    if (this._p5) {
      this._p5.remove();
      this._p5 = null as any;
      this._draw();
    }
  }
}
