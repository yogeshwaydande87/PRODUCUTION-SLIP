import create from 'zustand';

export const useCompanyStore = create((set) => ({
  currentCompany: null,
  currentCompanyName: '',
  setCurrentCompany: (companyId, companyName = '') => set({ 
    currentCompany: companyId,
    currentCompanyName: companyName
  }),
  clearCompany: () => set({ currentCompany: null, currentCompanyName: '' })
}));
