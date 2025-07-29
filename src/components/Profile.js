import React, { useEffect, useState } from 'react'
import { Image, HeaderContent, HeaderSubheader, Header, Divider, Input, Button, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import firebase from '../firebase'

const Profile = () => {
  const { data } = useSelector(getApp)
  const [ location, setLocation ] = useState('')
  const [ loadLoc, setLoadLoc ] = useState(false)
  const { LAST_NAME, FIRST_NAME, PLATE_NO, IMG, DRIVERS_LICENSE, CONTACT_NO, DRIVER_CODE, LOC } = data.DRIVER_DETAILS

  const handleLocationChange = (e) => {
    const { value } = e.target
    setLocation(value)
  }

  useEffect(()=>{
    if(LOC){
      setLocation(LOC)
    }
  },[])

  const handleOnClick = async() => {
    if(data.ACCOUNT_CODE){
      setLoadLoc(true)
      const db = await firebase.firestore();
  
      setTimeout(()=>{
        // UPDATE DB
        db.collection("drivers").doc(data.ACCOUNT_CODE).update({
          DRIVER_DETAILS:{
            ...data.DRIVER_DETAILS,
            LOC: location
          }
        })
  
        setLoadLoc(false)
      },1000)
    }
  }

  const handleTrash = () => {
    setLocation('')
  }

  return (
    <div className="profile">
        
        <Header as='h1'>
        <Image src={IMG} size='xl' verticalAlign='middle' rounded/>
         <HeaderContent>
          {`${LAST_NAME}, ${FIRST_NAME}`}
        </HeaderContent>
        </Header>

        <Divider/>

        <Header as='h2'>
          Current Location
          <HeaderSubheader>
          {LOC}
          </HeaderSubheader>
        </Header>

        <Button icon onClick={handleTrash}>
          <Icon name='trash'/>
        </Button>
        <Input 
          size='small'
          action={{
            color: 'red',
            labelPosition: 'left',
            icon: 'map pin',
            content: 'Set',
            onClick: () => handleOnClick()
          }}
          value={location}
          placeholder='Location'
          onChange={handleLocationChange}
        />

        <Header as='h2'>
          {PLATE_NO}
          <HeaderSubheader>
            Plate Number
          </HeaderSubheader>
        </Header>

        <Header as='h2'>
          {DRIVERS_LICENSE}
          <HeaderSubheader>
            Driver's License
          </HeaderSubheader>
        </Header>

        <Header as='h2'>
          {data.ACCOUNT_CODE}
          <HeaderSubheader>
            Account Code
          </HeaderSubheader>
        </Header>

        <Header as='h2'>
          {CONTACT_NO}
          <HeaderSubheader>
            Contact Number
          </HeaderSubheader>
        </Header>

        <Header as='h2'>
          {DRIVER_CODE}
          <HeaderSubheader>
            Driver Code
          </HeaderSubheader>
        </Header>
    </div>
  )
}

export default Profile
