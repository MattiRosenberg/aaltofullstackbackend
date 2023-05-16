import { filterAnecdotes, filterChanged } from "../reducers/filterReducer";
import { useSelector, useDispatch } from "react-redux";

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    event.preventDefault();
    dispatch({type: 'filter/filterReducer', payload: event.target.value})
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
