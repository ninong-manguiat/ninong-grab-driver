import React, { useState, useEffect } from 'react'
import { PAGES } from './utils/constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Header, Icon } from 'semantic-ui-react';
import appSlice, { getApp } from './store/slice/app.slice';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const [ hasData, setHasData ] = useState(false)
  const { data } = useSelector(getApp)

  useEffect(()=>{
    const app = JSON.parse(window.sessionStorage.getItem('app'))
    if(app === null) {
      setHasData(false)
    }else{
      setHasData(true)
      dispatch(appSlice.actions.setData(app))
    }
  },[])

  return (
    <div className="App">
      {
        hasData && <Dashboard/>
      }
      {
        !hasData && <Login/>
      }
    </div>
  );
}

export default App;
