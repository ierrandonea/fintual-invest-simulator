import React, { useState, useEffect } from 'react';
import getState from './flux';
import * as moment from 'moment'

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
  const StoreWrapper = props => {
    const [state, setState] = useState(getState({
      getStore: () => state.store,
      getActions: () => state.actions,
      setStore: updateStore => setState({
        store: Object.assign(state.store, updateStore),
        actions: { ...state.actions }
      })
    }));
    let date = new Date()
    const maxDate = moment(date).format('DD-MM-YYYY')    

    useEffect(() => {
      state.actions.getClooney(maxDate);
      state.actions.getPit(maxDate);
      state.actions.getNorris(maxDate);
    }, []);

    useEffect(() => {
      state.actions.validatePercent();
    }, [])

    return (
      <Context.Provider value={state}>
        <PassedComponent {...props} />
      </Context.Provider>
    )

  }
  return StoreWrapper;
}

export default injectContext;