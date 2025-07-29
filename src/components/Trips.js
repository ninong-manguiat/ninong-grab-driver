import React, { useEffect, useState } from 'react'
import { Image, HeaderContent, HeaderSubheader, Header, Divider, Input, Button, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import firebase from '../firebase'

const Trips = () => {
  const { data } = useSelector(getApp)
  const { LAST_NAME, FIRST_NAME, IMG } = data.DRIVER_DETAILS

//   const getBookingDetails = async(code) => {
//     const db = await firebase.firestore();
//     var bookings = db.collection("bookings");

//     const res = bookings.doc(code).get().then((fields) => {
//         return fields.data()
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });

//     return res
//   }

//   const renderBookingDetails = (code) => {
//     const details = getBookingDetails(code)
//     const a = ''
//     const b = ''
//     const c = ''

//     return (
//         <Header as='h2'>
//           {/* {code} */}
//           <HeaderSubheader>
//             {`Php ${a}`}<br/>
//             {/* {`${ORIGIN?.ADD} to ${DESTINATION?.ADD}`}` */}
//           </HeaderSubheader>
//         </Header>
//     )
//   } 

  return (
    <div className="profile">
        
        <Header as='h1'>
        <Image src={IMG} size='xl' verticalAlign='middle' rounded/>
         <HeaderContent>
          {`${LAST_NAME}, ${FIRST_NAME}`}
        </HeaderContent>
        </Header>

        <Divider/>
        {
            data.TRIPS?.map((code,i)=>{
                // return renderBookingDetails(code)
                return (
                    <>
                    {code}
                    <br/>
                    </>
                )
            })
        }
    </div>
  )
}

export default Trips
