import { Component } from '@angular/core';
import { LinescanComponent } from './ui/linescan/linescan.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MicroscopeComponent } from './ui/microscope/microscope.component';
import { MicroscopeOptionsComponent } from './ui/microscope-options/microscope-options.component';

@Component({
  selector: 'sem-simulation',
  imports: [
    LinescanComponent,
    ReactiveFormsModule,
    MicroscopeComponent,
    MicroscopeOptionsComponent,
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss',
})
export class SimulationComponent {}
