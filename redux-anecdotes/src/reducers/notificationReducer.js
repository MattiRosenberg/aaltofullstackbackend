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
export default notificationSlice.reducer;
