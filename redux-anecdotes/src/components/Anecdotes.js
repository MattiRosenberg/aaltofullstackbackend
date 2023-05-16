import { useDispatch } from 'react-redux';

const Anecdotes = () => {
  const dispatch = useDispatch();

  const add = (event) => {
    event.preventDefault();
    dispatch({ type: 'anecdote/add', payload: event.target.anecdote.value });
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
