import { create } from 'zustand'

interface Firework {
  id: number
  position: [number, number, number]
  createdAt: number
}

interface AppState {
  rotationSpeed: number
  snowEnabled: boolean
  mouseX: number
  mouseY: number
  fireworks: Firework[]
  triggerFirework: () => void
  removeFirework: (id: number) => void
  setRotationSpeed: (speed: number) => void
  toggleSnow: () => void
  setMousePosition: (x: number, y: number) => void
}

let fireworkId = 0

export const useStore = create<AppState>((set) => ({
  rotationSpeed: 0.3,
  snowEnabled: true,
  mouseX: 0,
  mouseY: 0,
  fireworks: [],
  triggerFirework: () =>
    set((state) => ({
      fireworks: [
        ...state.fireworks,
        { id: fireworkId++, position: [0, 4.2, 0], createdAt: Date.now() },
      ],
    })),
  removeFirework: (id: number) =>
    set((state) => ({
      fireworks: state.fireworks.filter((f) => f.id !== id),
    })),
  setRotationSpeed: (speed: number) => set({ rotationSpeed: speed }),
  toggleSnow: () => set((state) => ({ snowEnabled: !state.snowEnabled })),
  setMousePosition: (x: number, y: number) => set({ mouseX: x, mouseY: y }),
}))
