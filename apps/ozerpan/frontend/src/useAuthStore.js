import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // Başlangıçta kullanıcı bilgisi yok
  setUser: (userInfo) => set({ user: userInfo }), // Kullanıcı bilgilerini günceller
  clearUser: () => set({ user: null }), // Kullanıcı bilgilerini temizler
}));

export default useAuthStore;
