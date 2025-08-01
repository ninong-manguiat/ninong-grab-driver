import React, { useEffect, useState } from 'react'
import { Grid, GridRow, Segment, GridColumn, Image, HeaderContent, HeaderSubheader, Header, Divider, Button, Feed, FeedEvent, FeedContent, Modal, ModalContent, Input, ModalActions, ModalHeader, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux';
import appSlice, { getApp } from '../store/slice/app.slice';
import { DRIVER_STATUS, BOOKING_STATUS } from '../utils/constants';
import firebase from '../firebase'
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader';

const Trip = () => {
  const { data } = useSelector(getApp)
  const { STATUS, ACCOUNT_CODE, DRIVER_DETAILS, TRIP, TRIPS } = data
  const { LAST_NAME, FIRST_NAME, PLATE_NO, IMG, DRIVERS_LICENSE, CONTACT_NO, DRIVER_CODE } = DRIVER_DETAILS
  const [ loadBtn, setLoadBtn ] = useState(false)
  const [ loadTrip , setLoadTrip ] = useState(false)
  const [ modalConfirm , setModalConfirm ] = useState(false)
  const [ confirmLoad , setConfirmLoad ] = useState(false)
  const [ actualAmount , setActualAmount ] = useState('')
  const [ tripDetails , setTripDetails ] = useState()

  const [ mainTripModal , setMainTripModal ] = useState(true)

  const dispatch = useDispatch();

  useEffect(()=>{
    fetchTripDetails()
  },[TRIP])

  const fetchTripDetails = async() => {
    setLoadTrip(true)
    const db = await firebase.firestore();
    var bookings = db.collection("bookings");

    // READ APPLICATION
    if(TRIP){
    var tripDetails = bookings.doc(TRIP).get().then((fields) => {
        return fields.data()
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    Promise.all([tripDetails]).then((values) => {
        if(values[0]){
            setTimeout(()=>{
                setLoadTrip(true)
                setTripDetails(values[0])
            },500)
        }else{
            setLoadTrip(true)
        }
    });
    }
  }

  // OFFLINE COMPONENTS

  const renderOffline = () => {
    return (
      <div className="offline">
        <Header as='h2' icon>
          <Icon name='close' color='red'></Icon>
          <HeaderContent>
          You are currently offline
          <HeaderSubheader>You are in Walk-in Mode</HeaderSubheader>
          </HeaderContent>
        </Header>
      </div>
    )
  }

  const renderOfflineBtn = () => {
    return (
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='red' onClick={handleOfflineBtn} loading={loadBtn}>GO ONLINE</Button>
          </GridColumn>
        </GridRow>
        </Grid>
    )
  }

  const handleOfflineBtn = async() => {
      const db = await firebase.firestore();
      setLoadBtn(true)

      setTimeout(()=>{

        // UPDATE REDUX
        dispatch(appSlice.actions.setData({...data, STATUS: DRIVER_STATUS.AVAILABLE }))

        // UPDATE DB
        db.collection("drivers").doc(ACCOUNT_CODE).update({
          STATUS: DRIVER_STATUS.AVAILABLE
        })

        setLoadBtn(false)
      },1000)
  }
  
  // AVAILABLE COMPONENTS

  const renderAvailable = () => {
    return (
      <div className="available">
        <Header as='h2' icon>
          <Icon name='check' color='green'></Icon>
          <HeaderContent>
          You are currently available
          <HeaderSubheader>Waiting for passenger...</HeaderSubheader>
          </HeaderContent>
        </Header>
      </div>
    )
  }

  const renderAvailableBtn = () => {
    return (
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='grey' onClick={handleAvailableBtn} loading={loadBtn}>GO OFFLINE</Button>
          </GridColumn>
        </GridRow>
        </Grid>
    )
  }

  const handleAvailableBtn = async() => {
      const db = await firebase.firestore();
      setLoadBtn(true)

      setTimeout(()=>{

        // UPDATE REDUX
        dispatch(appSlice.actions.setData({...data, STATUS: DRIVER_STATUS.OFFLINE }))

        // UPDATE DB
        db.collection("drivers").doc(ACCOUNT_CODE).update({
          STATUS: DRIVER_STATUS.OFFLINE
        })

        setLoadBtn(false)
      },1000)
  }

  const handleCancelBooking = async() => {
    if(TRIP && ACCOUNT_CODE){
      const db = await firebase.firestore();
      db.collection("bookings").doc(TRIP).update({
          STATUS: BOOKING_STATUS.QUEUE
      })
  
      db.collection("drivers").doc(ACCOUNT_CODE).update({
        STATUS: DRIVER_STATUS.OFFLINE,
        TRIP: ''
      })
    }
  }

  // INTRANSIT

  const renderInTransit = () => {
    if(tripDetails){
      const { CUSTOMER_DETAILS, STATUS, ID, ORIGIN, DESTINATION, DATE, ROUTE_COMPUTATION } = tripDetails
      const { NAME, CONTACT_NUMBER, REMARKS } = CUSTOMER_DETAILS
      const { d, t } = DATE
      const { ESTIMATE_AMOUNT } = ROUTE_COMPUTATION
      let url = "https://www.google.com/maps/embed/v1/directions?origin=" + ORIGIN.LAT + "," + ORIGIN.LNG + "&destination=" + DESTINATION.LAT + "," + DESTINATION.LNG + "&zoom=13&key=AIzaSyCLMHif6cuDU8xgbvBNpBHMC218KFdjueo"
      
      return (
        <div className="intransit">
            <Feed>
                <FeedEvent>
                    <FeedContent date={'BOOKING DETAILS'} summary={() => {
                        return(<>{d}<br/>{t}</>)
                    }} />
                </FeedEvent>
                <br/>
                <FeedEvent>
                    <FeedContent date={'BOOKING STATUS'} summary={() => {
                        return(<>{STATUS}</>)
                    }} />
                </FeedEvent>
                <br/>
                <FeedEvent>
                    <FeedContent date={'ORIGIN'} summary={() => {
                        return(<>{ORIGIN.ADDRESS}</>)
                    }} />
                    <FeedContent date={'DESTINATION'} summary={() => {
                        return(<>{DESTINATION.ADDRESS}</>)
                    }} />
                </FeedEvent>
                <br/>
                <FeedEvent>
                    <FeedContent date={'CLIENT DETAILS'} summary={() => {
                        return(<>{NAME}<br/>{CONTACT_NO}</>)
                    }} />
                    <FeedContent date={'ESTIMATE AMOUNT'} summary={() => {
                        return(<>{ESTIMATE_AMOUNT}<br/>{}</>)
                    }} />
                </FeedEvent>
                <br/>
            </Feed>
            <iframe src={url} frameborder="0" style={{border:0}} width="100%" height="300"/>
            <Button fluid onClick={() => handleCancelBooking()} color='red'>REASSIGN TRIP</Button>
        </div>
      )
    }else{
      return <></>
    }

  }

  const handleLocate = (isOrigin) => {
    if(tripDetails){
      const { ORIGIN, DESTINATION } = tripDetails

      if(isOrigin){
        window.open(`https://www.google.com/maps/?q=${ORIGIN.LAT},${ORIGIN.LNG}`)
      }else{
        window.open(`https://www.google.com/maps/?q=${DESTINATION.LAT},${DESTINATION.LNG}`)
      }
    }
  }

  const renderInTransitBtn = () => {
    const cbtn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.C1)}>CONFIRM TRIP</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    const c1btn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={8}>
          <Button fluid size="huge" color='grey' loading={loadBtn} onClick={() => handleLocate(true)}>LOCATE ORIGIN</Button>
          </GridColumn>
          <GridColumn width={8}>
          <Button fluid size="huge" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.C2)}>START TRIP TO ORIGIN</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    const c2btn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.C3)}>ARRIVED AT ORIGIN</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    const c3btn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={8}>
          <Button fluid size="large" color='grey' loading={loadBtn} onClick={() => handleLocate(false)}>LOCATE DESTINATION</Button>
          </GridColumn>
          <GridColumn width={8}>
          <Button fluid size="large" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.C4)}>START TRIP TO DESTINATION</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    const c4btn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.C5)}>ARRIVED AT DESTINATION</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    const c5btn = () => {
      return (
        <div className="button-selection-btm">
        <Grid>
        <GridRow>
          <GridColumn width={16}>
          <Button fluid size="massive" color='red' loading={loadBtn} onClick={() => handleInTransitBtn(BOOKING_STATUS.DONE)}>TRIP COMPLETED</Button>
          </GridColumn>
        </GridRow>
        </Grid>
        </div>
      )
    }

    switch(tripDetails.STATUS){
      case BOOKING_STATUS.C: return cbtn()
      case BOOKING_STATUS.C1: return c1btn()
      case BOOKING_STATUS.C2: return c2btn()
      case BOOKING_STATUS.C3: return c3btn()
      case BOOKING_STATUS.C4: return c4btn()
      case BOOKING_STATUS.C5: return c5btn()
    }
  }

  const handleInTransitBtn = async(bookingStat) => {
      const db = await firebase.firestore();
      setLoadBtn(true)

      setTimeout(()=>{
        // UPDATE DB
        db.collection("bookings").doc(TRIP).update({
          STATUS: bookingStat
        })

        if(bookingStat === BOOKING_STATUS.DONE){
          // MODAL OPEN
          setModalConfirm(true)
          setMainTripModal(false)
        }

        fetchTripDetails()
        setLoadBtn(false)
      },1000)
  }

  const handleDone = async() => {
    if(TRIP){
      let tripsArr = []

      if(TRIPS){
        tripsArr = [...TRIPS]
        tripsArr.push(TRIP)
      }

      const db = await firebase.firestore();
      setConfirmLoad(true)
      setTimeout(()=>{
        db.collection("drivers").doc(ACCOUNT_CODE).update({
          STATUS: DRIVER_STATUS.AVAILABLE,
          TRIP: '',
          TRIPS: tripsArr
        })

        db.collection("bookings").doc(TRIP).update({
          ACTUAL_AMOUNT: actualAmount,
        })

        setConfirmLoad(false)
        setModalConfirm(false)
        setMainTripModal(true)
      },[2000])
    }
  }

  // GENERAL RENDERS

  const renderButtons = () => {
    switch (STATUS) {
      case DRIVER_STATUS.OFFLINE: return renderOfflineBtn()
      case DRIVER_STATUS.AVAILABLE: return renderAvailableBtn()
      case DRIVER_STATUS.INTRANSIT: return tripDetails ? renderInTransitBtn() : ''
      default: return ''
    }
  } 

  const renderContent = () => {
    switch (STATUS) {
      case DRIVER_STATUS.OFFLINE: return renderOffline()
      case DRIVER_STATUS.AVAILABLE: return renderAvailable()
      case DRIVER_STATUS.INTRANSIT: return renderInTransit()
      default: return ''
    }
  }

  const handleActualAmountChange = (e) => {
    const { value } = e.target
    setActualAmount(value)
  }

  const renderModalConfirmation = () => {
    return <Modal
      size='mini'
      onClose={() => {}}
      open={modalConfirm}
      closeOnDimmerClick={false}
      className='modal-confirmation'
    >
    <ModalHeader>
      Actual Amount of Trip
    </ModalHeader>
    <ModalContent>
      <Input 
      size='large'
      fluid
      value={actualAmount}
      placeholder='Actual Amount'
      onChange={handleActualAmountChange}
      />
    </ModalContent>
    <ModalActions>
      <Button color='red' onClick={handleDone} loading={confirmLoad}>
        Confirm Trip Completion
      </Button>
    </ModalActions>
    </Modal>
  }

  const handleOncloseMainModal = () => {
    setMainTripModal(false)
  }

  const renderMainTripModal = () => {
    return <Modal
      className='main-modal'
      size='fullscreen'
      onClose={handleOncloseMainModal}
      open={mainTripModal}
      closeOnDimmerClick={TRIP ? false : true}
    >
    {
      TRIP && <ModalHeader>
      <Header as="h2">
        {STATUS}
        <HeaderSubheader>Trip Code: {TRIP}</HeaderSubheader>
      </Header>
     </ModalHeader>
    }
    <ModalContent scrolling>
    {renderContent()} 
    </ModalContent>
    <ModalActions>
    {renderButtons()} 
    </ModalActions>
    </Modal>
  }

  return (
    <div className="trip">
      {renderModalConfirmation()}
      {renderMainTripModal()}
    </div>
  )
}

export default Trip
