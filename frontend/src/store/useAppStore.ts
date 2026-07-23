import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
}

export interface AppState {
  user: UserProfile | null
  isAuthenticated: boolean
  activeTab: string
  setUser: (user: UserProfile | null) => void
  setActiveTab: (tab: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '1',
    name: 'Demba Diallo',
    email: 'demba.diallo@geestu.ai',
    role: 'Candidat',
  },
  isAuthenticated: true,
  activeTab: 'dashboard',
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
