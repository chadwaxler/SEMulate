import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LinescanComponent } from '@shared/components/linescan/linescan.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Parameters,
  SemulateComponent,
} from '@shared/components/semulate/semulate.component';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  map,
  startWith,
  tap,
} from 'rxjs';
import { LinescanDataService } from '@shared/services/linescan-data.service';

@Component({
  selector: 'sem-from-api',
  standalone: true,
  imports: [
    AsyncPipe,
    LinescanComponent,
    NgIf,
    ReactiveFormsModule,
    SemulateComponent,
  ],
  templateUrl: './from-api.component.html',
  styleUrl: './from-api.component.scss',
})
export class FromApiComponent implements AfterViewInit {
  private _lineData = inject(LinescanDataService);

  public readonly formGroup = new FormGroup({
    numLines: new FormControl<number>(3, { nonNullable: true }),
    ivRadius: new FormControl<number>(10, { nonNullable: true }),
    ivDepth: new FormControl<number>(10, { nonNullable: true }),
    electronsPerFrame: new FormControl<number>(1000, { nonNullable: true }),
    energyMean: new FormControl<number>(50, { nonNullable: true }),
    energyStdDev: new FormControl<number>(20, { nonNullable: true }),
  });

  public valueChanges$ = this.formGroup.valueChanges.pipe(
    startWith(this.formGroup.value),
  );
  public sketchWidth$ = new BehaviorSubject(0);
  public params$ = combineLatest([this.valueChanges$, this.sketchWidth$]).pipe(
    map(([values, width]) => {
      const params: Parameters = {
        canvas: {
          width: width,
          height: 200,
        },
        numLines: values.numLines!,
        interactionVolume: {
          radius: values.ivRadius!,
          depth: values.ivDepth!,
        },
        secondaryElectrons: {
          numPerFrame: values.electronsPerFrame!,
          energyMean: values.energyMean!,
          energyStdDev: values.energyStdDev!,
        },
      };

      return params;
    }),
  );

  @ViewChild('sketchContainer')
  protected _sketchContainer!: ElementRef;

  public ngAfterViewInit() {
    const onResize$ = fromEvent(window, 'resize')
      .pipe(
        startWith(null),
        map(() => this._getSketchWidth()),
        tap((width) => this.sketchWidth$.next(width)),
      )
      .subscribe();
  }

  public onSubmit() {
    this._lineData.fetchData();
  }

  private _getSketchWidth(): number {
    const padding = 64;
    return this._sketchContainer?.nativeElement?.offsetWidth - padding;
  }
}
