import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useReducer } from 'react';

import axios from 'axios';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { voteAnecdote } from './request';
import NotificationContext from './NotificationContext';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'message':
      console.log('message:', action.payload);
      return action.payload;
    default:
      console.log('empty');
      return '';
  }
};

const App = () => {
  const queryClient = useQueryClient();
  const newMutation = useMutation(voteAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdote');
    },
    onError: () => {
      notificationDispatch({
        type: 'message',
        payload: 'content needs to be atleast five charasters long',
      });
    },
  });

  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  );

  const result = useQuery('anecdote', () =>
    axios.get('http://localhost:3001/anecdotes').then((res) => res.data)
  );

  if (result.isLoading) {
    return <div>loading...</div>;
  } else if (result.isError) {
    return <div>Error while loading anecdotes. Please try again.</div>;
  }

  const handleVote = (anecdote) => {
    console.log('handleVote');
    notificationDispatch({ type: 'message', payload: anecdote.content });

    setTimeout(() => {
      notificationDispatch({ type: 'message' });
    }, 5000);

    newMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const anecdotes = result.data;

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <div>
        <h3>Anecdote app</h3>

        <Notification message={notification} />
        <AnecdoteForm />

        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default App;
