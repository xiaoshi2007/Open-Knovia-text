import { create } from 'zustand';

interface AppState {
  user: {
    id: string;
    name: string;
    role: 'student' | 'teacher' | 'enterprise' | null;
    avatar?: string;
    token?: string;
    phone?: string;
  };
  sidebarCollapsed: boolean;
  login: (user: { id: string; name: string; role: 'student' | 'teacher' | 'enterprise'; avatar?: string; token?: string; phone?: string }) => void;
  logout: () => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '',
    name: '',
    role: null,
    avatar: '',
    token: '',
    phone: '',
  },
  sidebarCollapsed: false,
  login: (user) => set({ user }),
  logout: () =>
    set({
      user: { id: '', name: '', role: null, avatar: '', token: '', phone: '' },
    }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
