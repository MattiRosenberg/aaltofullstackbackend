import { useDispatch } from 'react-redux';
import { add } from '../reducers/anecdoteReducer';

const Anecdotes = () => {
  const dispatch = useDispatch();

  const submit = async (event) => {
    event.preventDefault();
    dispatch(add(event.target.anecdote.value))
    event.target.anecdote.value = '';
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default Anecdotes;
