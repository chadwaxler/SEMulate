import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./on-client/on-client.component').then(
        (m) => m.OnClientComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'sim',
    loadComponent: () =>
      import('./simulation/simulation.component').then(
        (m) => m.SimulationComponent,
      ),
  },
];
