import { useMutation, useQueryClient } from 'react-query';
import { createAnecdote } from '../request';
import { useContext } from 'react';
import NotificationContext from "../NotificationContext";

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext);

  const queryClient = useQueryClient();
  const newMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdote');
    },
    onError: () => {
      dispatch({
        type: 'message',
        payload: 'content needs to be more than 4 characteres long',
      });
      setTimeout(() => {
        dispatch({ type: 'message' });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    var content = event.target.anecdote.value;

    event.target.anecdote.value = '';

    newMutation.mutate({ content, important: true, votes: 0 });
    console.log('new anecdote');
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
