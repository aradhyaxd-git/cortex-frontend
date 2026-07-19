import { create } from 'zustand'
import type { NetworkState, SystemEvent, Train } from '@/types/domain'
import { MOCK_NETWORK_STATE, INITIAL_EVENTS } from '@/data/mockData'

interface NetworkStore {
  state: NetworkState
  events: SystemEvent[]
  selectedTrainId: string | null
  setSelectedTrain: (id: string | null) => void
  addEvent: (event: SystemEvent) => void
  updateTrainProgress: () => void
}

export const useNetworkStore = create<NetworkStore>((set, get) => ({
  state: MOCK_NETWORK_STATE,
  events: INITIAL_EVENTS,
  selectedTrainId: null,

  setSelectedTrain: (id) => set({ selectedTrainId: id }),

  addEvent: (event) =>
    set((s) => ({ events: [...s.events, event].slice(-50) })),

  updateTrainProgress: () =>
    set((s) => ({
      state: {
        ...s.state,
        trains: s.state.trains.map((t: Train) => {
          if (t.currentSegmentId && t.status !== 'WAITING' && t.status !== 'STOPPED') {
            const newProgress = Math.min(t.segmentProgress + 0.002, 1)
            return { ...t, segmentProgress: newProgress }
          }
          return t
        }),
        lastUpdated: new Date().toISOString(),
      },
    })),
}))
