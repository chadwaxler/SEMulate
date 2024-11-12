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
import { InteractionVolume } from './interaction-volume';
import { LinescanDataService } from '../../services/linescan-data.service';

export interface Parameters {
  canvas: {
    width: number;
    height: number;
  };
  numLines: number;
  interactionVolume: {
    radius: number;
    depth: number;
  };
  secondaryElectrons: {
    numPerFrame: number;
    energyMean: number;
    energyStdDev: number;
  };
}

const DEFAULTS: Parameters = {
  canvas: {
    width: 600,
    height: 300,
  },
  numLines: 3,
  interactionVolume: {
    radius: 10,
    depth: 10,
  },
  secondaryElectrons: {
    numPerFrame: 1000,
    energyMean: 50,
    energyStdDev: 20,
  },
};

@Component({
  selector: 'sem-semulate',
  standalone: true,
  imports: [],
  templateUrl: './semulate.component.html',
  styleUrl: './semulate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemulateComponent implements OnDestroy, AfterViewInit {
  @Input() public set parameters(value: Parameters) {
    const widthChanged = this._params.canvas.width !== value.canvas.width;
    this._params = value;

    if (this._p5) {
      if (widthChanged) {
        // If width changed, then we have to remove and recreate sketch
        this._p5.remove();
        this._p5 = null as any;
        this._draw();
      } else {
        this._redraw();
      }
    }
  }

  private readonly _linescanData = inject(LinescanDataService);
  private _p5!: p5;
  private _params = DEFAULTS;

  @ViewChild('sketch')
  private _sketch!: ElementRef;

  public ngAfterViewInit(): void {
    this._draw();
  }

  public ngOnDestroy(): void {
    if (this._p5) {
      this._p5.remove();
      this._p5 = null as any;
    }
  }

  private _draw(): void {
    this._p5 = new p5((p: p5) => {
      const width = this._params.canvas.width;
      const height = this._params.canvas.height;

      const scanner = new Scanner(p, width);
      const lineGeometry = new GeometryLines(p, width, height);
      lineGeometry.numLines = this._params.numLines;

      // SETUP Lifecycle
      p.setup = () => {
        p.createCanvas(width, height);
      };

      p.draw = () => {
        p.background(220);
        p.stroke(0);

        lineGeometry.numLines = this._params.numLines;
        lineGeometry.draw();

        const yGeometry = lineGeometry.getYGeometry(scanner.xPosition);
        const interactionVolume = new InteractionVolume(
          p,
          scanner.xPosition,
          yGeometry,
          this._params.interactionVolume.depth,
          this._params.interactionVolume.radius,
        );
        interactionVolume.draw();
        scanner.draw();

        let escapedElectrons = 0;
        for (let i = 0; i < this._params.secondaryElectrons.numPerFrame; i++) {
          const [x, y] = interactionVolume.randomPoint;

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
            } else {
              // If the line is still in the material, draw it in red
              p.stroke(252, 42, 42, 5);
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

  private _redraw(): void {
    if (this._p5) {
      this._p5.redraw();
    }
  }
}
