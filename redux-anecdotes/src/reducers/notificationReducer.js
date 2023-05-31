import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    show(state, action) {
      console.log(action.payload);
      return action.payload;
    },

    remove(state, action) {
      return initialState;
    },
  },
});

export const { show, remove } = notificationSlice.actions;

export const showNotification = (message, timeOut) => {
  return async dispatch => {
    dispatch(show(message))

    setTimeout(() => {
      dispatch(remove());
    }, timeOut);
  }
}
export default notificationSlice.reducer;
