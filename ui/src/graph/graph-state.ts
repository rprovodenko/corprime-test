import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GraphState {
  dataPerSec: Array<[number, number]>;
  dataPerMin: Array<[number, number]>;
}
interface GraphStateActions {
  appendDataPointsPerSec: (dataPoint: [number, number][]) => void;
  appendDataPointsPerMin: (dataPoint: [number, number][]) => void;
}

const maxSeconds = Number(import.meta.env.VITE_MAX_SECONDS);
const maxMinutes = Number(import.meta.env.VITE_MAX_MINUTES);

export const useGraphState = create<GraphState & GraphStateActions>()(
  immer((set, get) => ({
    dataPerSec: [],
    dataPerMin: [],
    appendDataPointsPerSec: (dataPoints: [number, number][]) =>
      set((state) => {
        state.dataPerSec.push(...dataPoints);
        if (state.dataPerSec.length > maxSeconds) {
          state.dataPerSec = state.dataPerSec.slice(state.dataPerSec.length - maxSeconds)
        }
      }),
    appendDataPointsPerMin: (dataPoints: [number, number][]) =>
      set((state) => {
        state.dataPerMin.push(...dataPoints);
        if (state.dataPerMin.length > maxMinutes) {
          state.dataPerMin = state.dataPerMin.slice(state.dataPerMin.length - maxMinutes)
        }
      }),
  })),
);
