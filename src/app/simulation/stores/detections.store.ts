import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type DetectionsState = {
  detections: number[];
};

const initialState: DetectionsState = {
  detections: [],
};

export const DetectionsStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    updateValues(values: number[]): void {
      patchState(store, (state) => ({
        detections: values,
      }));
    },
  })),
);
