/* eslint-disable no-unused-vars */
import { vi } from "vitest";

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
      theme: "light",
      language: "pt-BR",
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

export const MockProvider = ({ children, store = mockReduxStore }) => {
  return children;
};

export const mockUseDispatch = vi.fn(() => mockReduxStore.dispatch);
export const mockUseSelector = vi.fn((selector) => {
  const state = mockReduxStore.getState();
  return selector(state);
});

export const mockReactRedux = {
  Provider: MockProvider,
  useDispatch: mockUseDispatch,
  useSelector: mockUseSelector,
  connect: vi.fn(
    (mapStateToProps, mapDispatchToProps) => (Component) => Component,
  ),
};

vi.mock("react-redux", () => mockReactRedux);

vi.mock("../../features/shared/hooks/useAppDispatch.js", () => ({
  useAppDispatch: mockUseDispatch,
  useAppSelector: mockUseSelector,
}));
