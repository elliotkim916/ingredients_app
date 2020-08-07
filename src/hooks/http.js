import { useReducer, useCallback } from 'react';
import axios from 'axios';

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.data,
        extra: action.extra,
        identifier: action.identifier,
      };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { loading: false, error: null };
    default:
      return httpState;
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    async (url, method, body, extra, identifier) => {
      dispatchHttp({ type: 'SEND_REQUEST' });
      try {
        const response = await axios({
          method,
          url,
          data: body,
        });

        if (response) {
          dispatchHttp({
            type: 'RESPONSE',
            data: response.data,
            extra,
            identifier,
          });
        }
      } catch (e) {
        dispatchHttp({ type: 'ERROR', error: e.message });
      }
    },
    []
  );

  return {
    loading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    extra: httpState.extra,
    identifier: httpState.identifier,
    clear,
  };
};

export default useHttp;
