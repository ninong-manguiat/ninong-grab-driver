import React, { useEffect, useState } from 'react'
import { Button, Icon, Header } from 'semantic-ui-react'
import { DRIVER_STATUS, PAGES } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from "../contexts/AuthContext"
import appSlice, { getApp } from '../store/slice/app.slice';
import firebase from '../firebase'
import SidebarComponent from '../components/SidebarComponent';
import Profile from '../components/Profile';
import Trip from '../components/Trip';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Trips from './Trips';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data } = useSelector(getApp)
    const [ visible, setVisible ] = useState(false)
    const [ tempLoad, setTempLoad ] = useState({})
    const [load, setLoad] = useState(false)

    const handleSideBar = () => {
      setVisible(!visible)
    }

    const getHeaderTitle = () => {
      switch(window.location.pathname){
        case PAGES.PROFILE: return 'Driver Profile'
        case PAGES.TRIP: return 'Trip'
        case PAGES.TRIPS: return 'Trips'
        default: return ''
      }
    }

    const renderHeader = () => {
      return (
          <div className="headerfd">
              <Icon name="content" size="large" color="red" onClick={handleSideBar} className="hamb"></Icon>
              <Header as='h2' className="headertitle">
                  {getHeaderTitle()}
              </Header>
          </div>
      )
    }

    useEffect(()=>{
      setLoad(!load)
    },[data])

    useEffect(()=>{
      dispatch(appSlice.actions.setData({ ...data, ...tempLoad }))
    },[tempLoad])

    useEffect(() => {
      const fetchSnaps = async() => {
        const db = await firebase.firestore();
        db.collection("drivers").doc(data.ACCOUNT_CODE)
        .onSnapshot((doc) => {
            setTempLoad(doc.data())
            dispatch(appSlice.actions.setData({ ...data, ...tempLoad }))
        });
      }

      const unsubscribe = fetchSnaps()
      return () => unsubscribe();
    }, []);

  return (
    <div className={`dashboard`}>
        <Router>
          <SidebarComponent
              visible={visible} 
              handleSideBar={handleSideBar}
          >
                {renderHeader()}
                <Route path={PAGES.PROFILE} component={Profile} />
                <Route path={PAGES.TRIP} component={Trip} />
                <Route path={PAGES.TRIPS} component={Trips} />
          </SidebarComponent>
          
        </Router>
    </div>
  )
}

export default Dashboard
