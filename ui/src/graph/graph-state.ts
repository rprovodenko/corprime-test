import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GraphState {
  dataPerSec: Array<[number, number]>;
  dataPerMin: Array<[number, number]>;
}
interface GraphStateActions {
  appendDataPointPerSec: (dataPoint: [number, number]) => void;
  appendDataPointPerMin: (dataPoint: [number, number]) => void;
}

export const useGraphState = create<GraphState & GraphStateActions>()(
  immer((set, get) => ({
    dataPerSec: [],
    dataPerMin: [],
    appendDataPointPerSec: (dataPoint: [number, number]) =>
      set((state) => {
        state.dataPerSec.push(dataPoint);
      }),
    appendDataPointPerMin: (dataPoint: [number, number]) =>
      set((state) => {
        state.dataPerMin.push(dataPoint);
      }),
  })),
);
