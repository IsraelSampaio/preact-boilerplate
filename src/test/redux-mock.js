import { vi } from 'vitest';

// Mock do react-redux para testes com Preact
export const mockReduxStore = {
  getState: vi.fn(() => ({
    auth: {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
    pokemon: {
      list: [],
      selectedPokemon: null,
      isLoading: false,
      error: null,
    },
    ui: {
      theme: 'light',
      language: 'pt-BR',
    },
    favorites: {
      list: [],
    },
    comparison: {
      pokemon: [],
    },
  })),
  dispatch: vi.fn(),
  subscribe: vi.fn(() => vi.fn()), // unsubscribe function
};

// Mock do Provider
export const MockProvider = ({ children, store = mockReduxStore }) => {
  return children;
};

// Mock dos hooks
export const mockUseDispatch = vi.fn(() => mockReduxStore.dispatch);
export const mockUseSelector = vi.fn((selector) => {
  const state = mockReduxStore.getState();
  return selector(state);
});

// Mock do react-redux
export const mockReactRedux = {
  Provider: MockProvider,
  useDispatch: mockUseDispatch,
  useSelector: mockUseSelector,
  connect: vi.fn((mapStateToProps, mapDispatchToProps) => (Component) => Component),
};

// Configurar o mock global
vi.mock('react-redux', () => mockReactRedux);

// Mock específico para os hooks customizados
vi.mock('../../features/shared/hooks/useAppDispatch.js', () => ({
  useAppDispatch: mockUseDispatch,
  useAppSelector: mockUseSelector,
}));
