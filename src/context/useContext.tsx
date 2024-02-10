'use client';

import { useContext, useReducer, createContext } from 'react';
import { Feature } from '~/types';

const DEFAULT_STATE = {
  features: [] as Feature[],
};

export type State = typeof DEFAULT_STATE;

export enum ActionType {
  DrawUpdate = 'DRAW_UPDATE',
  DrawDelete = 'DRAW_DELETE',
}

interface Payloads {
  [ActionType.DrawUpdate]: Feature[];
  [ActionType.DrawDelete]: Feature[];
}
export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type Actions = ActionMap<Payloads>[keyof ActionMap<Payloads>];

const reducer = (state: typeof DEFAULT_STATE, action: Actions) => {
  switch (action.type) {
    case ActionType.DrawUpdate: {
      return {
        ...state,
        features: [...state.features, ...action.payload],
      };
    }
    case ActionType.DrawDelete: {
      return {
        ...state,
        features: state.features.filter(
          (feature) => !action.payload.some((f) => f.id === feature.id),
        ),
      };
    }
    default:
      return state;
  }
};

const AppContext = createContext<{
  dispatch: React.Dispatch<Actions>;
  state: State;
}>({
  dispatch: () => null,
  state: DEFAULT_STATE,
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  return (
    <AppContext.Provider value={{ dispatch, state }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const { dispatch, state } = useContext(AppContext);

  return { dispatch, state };
};