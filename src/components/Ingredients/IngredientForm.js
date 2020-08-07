import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo((props) => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  console.log('RENDER INGREDIENT FORM', props);
  // much easier to have multiple states compared to below
  // dont have to worry about merging states

  // const [inputState, setInputState] = useState({ title: '', amount: '' });
  // whenever state updates, component will rebuild and useState is executed again
  // but React internally saves that you configured state with useState, and will not reinitialize it
  // instead, useState manages this state independent from your component so your state survives re-renders of this component
  // and therefore, useState returns the current state snapshot and for this re-render cycle
  // 1st element is the initial state or the updated state

  // Class based component will merge state automatically, but functional components will not

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  console.log('loading', props.loading);
  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={(e) => setEnteredTitle(e.target.value)}
              // onChange={(e) => {
              // in out setInputState function, we can pass a function
              // in that function, we can pass an argument that is passed in automatically by React
              // that argument allows us to access the latest state at all times
              //   const newTitle = e.target.value;
              // we do this because this is a closure and we want to make sure were generating a new title for every keystroke
              // using a new event object for every keystroke, instead of reusing a event object
              //   setInputState((prevInputState) => {
              //     return {
              //       title: newTitle,
              //       amount: prevInputState.amount,
              //     };
              //   });
              // }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={(e) => setEnteredAmount(e.target.value)}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
