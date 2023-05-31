import { useDispatch, useSelector } from 'react-redux';
import Filter from './components/Filter';
import Notification from './components/Notification';
import Anecdotes from './components/Anecdotes';
import { useEffect } from 'react';
import { initializeAnecdotes, vote } from './reducers/anecdoteReducer';
import { showNotification } from './reducers/notificationReducer';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  const anecdotes = useSelector((state) => {
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.toString().includes(state.filter)
    );
  });

  const handleVote = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(showNotification(anecdote.content, 5000))
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
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
      <h2>Filter</h2>
      <Filter />
    </div>
  );
};

export default App;
