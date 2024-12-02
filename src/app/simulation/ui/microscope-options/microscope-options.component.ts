import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OptionsState, OptionsStore } from '@stores/options.store';

@Component({
  selector: 'sem-microscope-options',
  imports: [ReactiveFormsModule],
  templateUrl: './microscope-options.component.html',
  styleUrl: './microscope-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroscopeOptionsComponent implements OnInit {
  private readonly _optionsStore = inject(OptionsStore);

  public readonly formGroup = new FormGroup({
    numLines: new FormControl(3),
    ivRadius: new FormControl(10),
    ivDepth: new FormControl(10),
    electronsPerFrame: new FormControl(1000),
    energyMean: new FormControl(50),
    energyStdDev: new FormControl(20),
  });

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((values) => {
      this._optionsStore.updateValues(values as OptionsState);
    });
  }
}
