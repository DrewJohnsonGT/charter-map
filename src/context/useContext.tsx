'use client';

import {
  createContext,
  RefObject,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { MapRef } from 'react-map-gl';
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
  mapRef: { current: null } as RefObject<MapRef>,
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
  UpdateFeature = 'UPDATE_FEATURE',
}

interface Payloads {
  [ActionType.DrawUpdate]: Feature[];
  [ActionType.DrawDelete]: Feature[];
  [ActionType.SetViewState]: ViewState;
  [ActionType.SetDrawReference]: MapboxDraw;
  [ActionType.FeatureSelected]: string[];
  [ActionType.LoadFeatures]: Feature[];
  [ActionType.UpdateFeature]: Pick<Feature, 'id'> &
    Partial<Omit<Feature, 'id'>>;
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
  console.log('action', action);
  switch (action.type) {
    case ActionType.DrawUpdate: {
      const updatedFeatures = state.features.map((feature) => {
        const featureUpdate = action.payload.find((f) => f.id === feature.id);
        return featureUpdate ? { ...feature, ...featureUpdate } : feature;
      });
      const newFeatures = action.payload.filter(
        (newFeature) =>
          !state.features.some((feature) => feature.id === newFeature.id),
      );
      const finalFeatures = [...updatedFeatures, ...newFeatures];
      return {
        ...state,
        features: [...finalFeatures],
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
      if (!state.draw) throw new Error('Draw reference not set');
      state.draw?.changeMode('simple_select', {
        featureIds: action.payload,
      });
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
    case ActionType.UpdateFeature: {
      const updatedFeatures = state.features.map((feature) => {
        if (feature.id === action.payload.id) {
          return { ...feature, ...action.payload };
        }
        return feature;
      });
      return {
        ...state,
        features: updatedFeatures,
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
  const mapRef = useRef<MapRef>(null);
  const [state, dispatch] = useReducer(reducer, { ...DEFAULT_STATE, mapRef });

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
