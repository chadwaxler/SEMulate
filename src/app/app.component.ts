import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SemulateComponent } from '@shared/components/semulate/semulate.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { LinescanComponent } from '@shared/components/linescan/linescan.component';
import { combineLatest, fromEvent, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'sem-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SemulateComponent,
    ReactiveFormsModule,
    AsyncPipe,
    LinescanComponent,
    NgIf,
    JsonPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  public readonly formGroup = new FormGroup({
    numLines: new FormControl<number>(3),
    ivRadius: new FormControl<number>(10),
    ivDepth: new FormControl<number>(10),
    electronsPerFrame: new FormControl<number>(1000),
    energyMean: new FormControl<number>(50),
    energyStdDev: new FormControl<number>(20),
  });

  public params$!: Observable<any>;

  @ViewChild('sketchContainer')
  protected _sketchContainer!: ElementRef;

  public ngAfterViewInit() {
    const sketchWidth$ = fromEvent(window, 'resize').pipe(
      startWith(0),
      map(() => this._getSketchWidth()),
    );

    const values$ = this.formGroup.valueChanges.pipe(
      startWith(this.formGroup.value),
    );

    this.params$ = combineLatest([values$, sketchWidth$]).pipe(
      map(([values, width]) => {
        const params = {
          canvas: {
            width: width,
            height: 200,
          },
          numLines: values.numLines,
          frameRate: 60,
          interactionVolume: {
            radius: values.ivRadius,
            depth: values.ivDepth,
          },
          secondaryElectrons: {
            numPerFrame: values.electronsPerFrame,
            energyMean: values.energyMean,
            energyStdDev: values.energyStdDev,
          },
        };

        return params;
      }),
    );
  }

  private _getSketchWidth(): number {
    const padding = 64;
    return this._sketchContainer?.nativeElement?.offsetWidth - padding;
  }
}
