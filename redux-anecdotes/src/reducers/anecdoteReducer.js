import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdote'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
   addObject(state, action) {
      state.push(action.payload)
    },
    setObjects(state, action) {
      return action.payload
    },
    updateObject(state, action) {
      const newObject = action.payload
      const index = state.findIndex(object => object.id === newObject.id)
      if (index !== -1) {
        state[index].votes = newObject.votes 
      }
    }
  },
});

export const { addObject, setObjects, updateObject } = anecdoteSlice.actions;

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

export const vote = content => {
  return async dispatch => {
    const voteAnecdote = { ...content, votes: content.votes + 1 }
    const votedAnecdote = await anecdoteService.vote(voteAnecdote)
    dispatch(updateObject(votedAnecdote))
  }
}

export default anecdoteSlice.reducer;
