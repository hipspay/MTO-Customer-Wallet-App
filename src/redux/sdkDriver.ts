import { AppDispatch } from '@rainbow-me/redux/store';

// -- Constants ------------------------------------------------------------- //
const SET_BKD_DRIVER = 'SET_BKD_DRIVER';
const SET_SC_DRIVER = 'SET_SC_DRIVER';
const CURRENT_TAB_INDEX = 'CURRENT_TAB_INDEX';

// -- Actions --------------------------------------------------------------- //
export const setBkdDriver = (data: any) => (dispatch: AppDispatch) => {
  dispatch({
    payload: data,
    type: SET_BKD_DRIVER,
  });
};

export const setScDriver = (data: any) => (dispatch: AppDispatch) => {
  // console.log('setScDriver', data);
  dispatch({
    payload: data,
    type: SET_SC_DRIVER,
  });
};

export const setCurrentTab = (data: any) => (dispatch: AppDispatch) => {
  // console.log('setScDriver', data);
  dispatch({
    payload: data,
    type: CURRENT_TAB_INDEX,
  });
};

// -- Reducer --------------------------------------------------------------- //
const initialState = {
  bkdDriver: null,
  currentTab: 0,
  scDriver: null,
};
export default (state = initialState, action: any) => {
  // console.log('default driver', state, action);
  switch (action.type) {
    case SET_BKD_DRIVER:
      return {
        ...state,
        bkdDriver: action.payload,
      };
    case SET_SC_DRIVER:
      return {
        ...state,
        scDriver: action.payload,
      };
    case CURRENT_TAB_INDEX:
      return {
        ...state,
        currentTab: action.payload,
      };
    default:
      return state;
  }
};
