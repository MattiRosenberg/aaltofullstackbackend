import { createSlice } from '@reduxjs/toolkit';

const initialState = '';
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    by(state, action) {
      return action.payload
    },
  },
});

export const { by } = filterSlice.actions;
export default filterSlice.reducer;
