import { useSelector} from 'react-redux';
import Filter from './components/Filter';

const App = () => {
  const anecdotes = useSelector((state) => {
      return state.anecdotes.filter((anecdote) =>
      anecdote.content.toString().includes(state.filter.content)
    );
  });

  const vote = (id) => {
    console.log('vote', id);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
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
