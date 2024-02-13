'use client';

import { createContext, useContext, useReducer } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { LATITUDE, LONGITUDE } from '~/constants';
import { Feature, ViewState } from '~/types';

const DEFAULT_STATE = {
  draw: null as MapboxDraw | null,
  features: [] as Feature[],
  loading: {
    drawReference: true,
    features: true,
  },
  selectedFeatureIds: [] as string[],
  storedFeatures: [] as Feature[],
  viewState: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    zoom: 10,
  },
};

export type State = typeof DEFAULT_STATE;

export enum ActionType {
  DrawUpdate = 'DRAW_UPDATE',
  DrawDelete = 'DRAW_DELETE',
  SetViewState = 'SET_VIEW_STATE',
  SetDrawReference = 'SET_DRAW_REFERENCE',
  FeatureSelected = 'FEATURE_SELECTED',
  LoadFeatures = 'LOAD_FEATURES',
}

interface Payloads {
  [ActionType.DrawUpdate]: Feature[];
  [ActionType.DrawDelete]: Feature[];
  [ActionType.SetViewState]: ViewState;
  [ActionType.SetDrawReference]: MapboxDraw;
  [ActionType.FeatureSelected]: string[];
  [ActionType.LoadFeatures]: Feature[];
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
    case ActionType.SetViewState: {
      return {
        ...state,
        viewState: action.payload,
      };
    }
    case ActionType.SetDrawReference: {
      return {
        ...state,
        draw: action.payload,
        loading: {
          ...state.loading,
          drawReference: false,
        },
      };
    }
    case ActionType.FeatureSelected: {
      return {
        ...state,
        selectedFeatureIds: action.payload,
      };
    }
    case ActionType.LoadFeatures: {
      if (!state.draw) throw new Error('Draw reference not set');
      action.payload.forEach((feature) => {
        state.draw?.add(feature);
      });
      return {
        ...state,
        features: action.payload,
        loading: {
          ...state.loading,
          features: false,
        },
        storedFeatures: action.payload,
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
