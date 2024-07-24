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
    path: 'from-api',
    loadComponent: () =>
      import('./from-api/from-api.component').then((m) => m.FromApiComponent),
  },
];
