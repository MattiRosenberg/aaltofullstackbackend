import { createSlice } from '@reduxjs/toolkit';

const getId = () => (100000 * Math.random()).toFixed(0);
const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    add(state, action) {
      state.push(asObject(action.payload))
    },
    addObject(state, action) {
      state.push(action.payload)
    },
    setObjects(state, action) {
      return action.payload
    }
  },
});

export const { add, addObject, setObjects } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
