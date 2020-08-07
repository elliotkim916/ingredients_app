import React, {
  // useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      return currentIngredients;
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  // useReducer doesnt get created again, react detects they are already initialized and uses that already initialized value
  const {
    loading,
    error,
    data,
    sendRequest,
    extra,
    identifier,
    clear,
  } = useHttp();

  // split up the handling of sending the request, and handling the response
  // handling the request is in the useHttp hook
  // handling the response is in the useEffect below
  useEffect(() => {
    if (!loading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: extra });
    } else if (!loading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: {
          id: data.name,
          ...extra,
        },
      });
    }
  }, [data, error, extra, identifier, loading]);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `https://react-hooks-update-e4eb6.firebaseio.com/ingredients.json`,
        'POST',
        ingredient,
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-update-e4eb6.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
      // setError(e.message);
      // setIsLoading(false);
      // react batches state updates, batching multiple updates together to prevent unnecessary render cycles
      // all state updates from one and the same synchronous event handler are batched together
      // for example, for setError and setIsLoading are run one after another and then react batches the two state updates together
      // having only ONE render cycle
      // also right in the next line, you cannot use the new state because
      // React wont go ahead and update the state and skip all the other code
      // Instead, react will execute all the other code in the same function and batch all state updates you scheduled there together
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // we use useCallback here to cache our function
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = useCallback(() => {
    clear();
  }, [clear]);

  // this value is not recreated unless if one of the dependencies changes
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [removeIngredientHandler, userIngredients]);

  console.log('RENDERING INGREDEIENTS PARENT');
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
