import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import p5 from 'p5';
import { GeometryLines } from './line-geometry';
import { Scanner } from './scanner';
import { AreaOfEffect } from './area-of-effect';
import { LinescanDataService } from '../../services/linescan-data.service';

const WIDTH = 600;
const HEIGHT = 300;
const POINTS_PER_FRAME = 1000;

@Component({
  selector: 'sem-semulate',
  standalone: true,
  imports: [],
  templateUrl: './semulate.component.html',
  styleUrl: './semulate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemulateComponent implements OnDestroy, AfterViewInit {
  private _params = {
    canvas: {
      width: WIDTH,
      height: HEIGHT,
    },
    numLines: 2,
    frameRate: 60,
    areaOfEffect: {
      radius: 20,
      depth: 10,
    },
    secondaryElectrons: {
      numPerFrame: 1000,
      energyMean: 50,
      energyStdDev: 20,
    },
  };

  @Input() public set parameters(value: any) {
    // If width changes, then we need to remove and recreate the p5 instance
    if (value.canvas.width !== this._params.canvas.width && this._p5) {
      this._params = value;
      this._p5.remove();
      this._p5 = null as any;
      this._draw();
    } else {
      this._params = value;
      if (this._p5) {
        this._redraw();
      }
    }
  }

  private _linescanData = inject(LinescanDataService);

  @ViewChild('sketch')
  protected _sketch!: ElementRef;

  protected _p5!: p5;

  public ngAfterViewInit() {
    this._draw();
  }

  private _draw() {
    this._p5 = new p5((p: p5) => {
      // const width = this._sketch.nativeElement.offsetWidth;
      const scanner = new Scanner(p, this._params.canvas.width);
      const lineGeometry = new GeometryLines(
        p,
        this._params.canvas.width,
        HEIGHT,
      );
      lineGeometry.numLines = this._params.numLines;

      // SETUP Lifecycle
      p.setup = () => {
        p.createCanvas(this._params.canvas.width, HEIGHT);
        p.frameRate(this._params.frameRate); // TODO: this.frameRate does not exist in constructor
      };

      p.draw = () => {
        p.background(220);
        p.stroke(0);

        lineGeometry.numLines = this._params.numLines;
        lineGeometry.draw();

        const region = lineGeometry.getRegion(scanner.xPosition);
        const areaOfEffect = new AreaOfEffect(
          p,
          scanner.xPosition,
          region.yGeometry,
          this._params.areaOfEffect.depth,
          this._params.areaOfEffect.radius,
        );
        areaOfEffect.draw();
        scanner.draw();

        let escapedElectrons = 0;
        for (let i = 0; i < this._params.secondaryElectrons.numPerFrame; i++) {
          const [x, y] = areaOfEffect.randomPoint;

          if (lineGeometry.isPointInMaterial(x, y)) {
            p.circle(x, y, 3);

            // Generate a random direction and magnitude for the line
            let lineAngle = p.random(p.TWO_PI);
            const mean = this._params.secondaryElectrons.energyMean;
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
            }
          }
        }

        scanner.setDetectionCount(scanner.xPosition, escapedElectrons);
        scanner.increment();
        this._linescanData.updateData(scanner.detections);
      };
    }, this._sketch.nativeElement);
  }

  public ngOnDestroy(): void {
    if (this._p5) {
      this._p5.remove();
      this._p5 = null as any;
    }
  }

  private _redraw(): void {
    if (this._p5) {
      this._p5.redraw();
    }
  }
}
