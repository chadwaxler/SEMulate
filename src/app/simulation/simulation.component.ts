import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinescanComponent } from '@ui/linescan/linescan.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MicroscopeComponent } from '@ui/microscope/microscope.component';
import { MicroscopeOptionsComponent } from '@ui/microscope-options/microscope-options.component';
import { OptionsStore } from '@stores/options.store';
import { DetectionsStore } from '@stores/detections.store';

@Component({
  selector: 'sem-simulation',
  imports: [
    LinescanComponent,
    ReactiveFormsModule,
    MicroscopeComponent,
    MicroscopeOptionsComponent,
  ],
  providers: [OptionsStore, DetectionsStore],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationComponent {}
