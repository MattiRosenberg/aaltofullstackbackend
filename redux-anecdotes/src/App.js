import { useDispatch, useSelector } from 'react-redux';
import Filter from './components/Filter';
import Notification from './components/Notification';
import Anecdotes from './components/Anecdotes';

const App = () => {
  const anecdotes = useSelector((state) => {
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.toString().includes(state.filter)
    );
  });

  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch({ type: 'notifications/show', payload: id });

    setTimeout(() => {
      dispatch({ type: 'notifications/remove', payload: '' });
    }, 5000);
  };

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Anecdotes />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>Filter</h2>
      <Filter />
    </div>
  );
};

export default App;
