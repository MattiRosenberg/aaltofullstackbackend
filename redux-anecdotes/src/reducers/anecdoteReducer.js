import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdote'

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
   addObject(state, action) {
      state.push(action.payload)
    },
    setObjects(state, action) {
      return action.payload
    }
  },
});

export const { addObject, setObjects } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setObjects(anecdotes))
  }
}

export const add = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addObject(newAnecdote))
  }
}

export default anecdoteSlice.reducer;
