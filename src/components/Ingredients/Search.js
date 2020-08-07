import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { loading, data, error, sendRequest, clear } = useHttp();

  // handle request
  useEffect(() => {
    // we want to call this in a useEffect because if we call this in the function component,
    // its being called in the render, and then because we are updating the state, it causes a re-render,
    // causing an infinite loop
    async function getData() {
      const query =
        enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${enteredFilter}"`;

      sendRequest(
        `https://react-hooks-update-e4eb6.firebaseio.com/ingredients.json${query}`,
        'GET'
      );
    }

    // here in this useEffect, we are setting up a new timer everytime time the input value changes (enteredFilter)
    const timer = setTimeout(() => {
      // the enteredFilter is not the current value, will be the old value from 500ms ago, the value from when we SET the timer!
      // this is checking if the user hasnt typed anything for 500ms, then to make the API call
      if (enteredFilter === inputRef.current.value) {
        getData();
      }
    }, 500);

    // runs before the next time the function in the useEffect runs, not after
    // for example, the function in useEffect runs, and then if enteredFilter changes, before the function in useEffect runs...
    // the function in the return statement runs
    // if you have 0 dependencies in the [], then the cleanup function runs when the component unmounts
    return () => {
      clearTimeout(timer);
      // this clears up the old timer before a new one is set up
    };
  }, [enteredFilter, inputRef, sendRequest]);
  // array with dependencies of your function
  // if dependencies change, then function re-runs
  // by default, useEffects runs after every render

  // handle response
  useEffect(() => {
    if (!loading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }

      onLoadIngredients(loadedIngredients);
    }
  }, [loading, error, data, onLoadIngredients]);

  console.log('RENDERING SEARCH');
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
