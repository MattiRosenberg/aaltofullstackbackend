import { useDispatch } from 'react-redux';
import anecdoteService from '../services/anecdote'

const Anecdotes = () => {
  const dispatch = useDispatch();

  const add = async (event) => {
    event.preventDefault();
    const newAnecdote = await anecdoteService.createNew(event.target.anecdote.value)
    dispatch({ type: 'anecdote/addObject', payload: newAnecdote});

    event.target.anecdote.value = '';
  };

  return (
    <div>
      <form onSubmit={add}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default Anecdotes;
