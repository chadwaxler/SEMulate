import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type OptionsState = {
  numLines: number;
  ivRadius: number;
  ivDepth: number;
  electronsPerFrame: number;
  energyMean: number;
  energyStdDev: number;
};

const initialState: OptionsState = {
  numLines: 3,
  ivRadius: 10,
  ivDepth: 10,
  electronsPerFrame: 1000,
  energyMean: 50,
  energyStdDev: 20,
};

export const OptionsStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    updateValues(values: Partial<OptionsState>): void {
      patchState(store, values);
    },
  })),
);
