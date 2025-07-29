import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Image, Message, Dimmer, Loader, Input, Label} from 'semantic-ui-react';
import Logo from '../assets/crownred.png'
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import appSlice, { getApp } from '../store/slice/app.slice';
import { CODES } from '../utils/codes';
import { PAGES } from '../utils/constants';
import firebase from '../firebase'

const Login = () => {
    const dispatch = useDispatch();
    const { 
        data
    } = useSelector(getApp)
    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const handlePassword = (e) => {
        const { value } = e.target
        dispatch(appSlice.actions.setData({...data, ACCOUNT_CODE: value.toUpperCase()}))
    }

    const handleSubmitCreds = async(e) => {
        setLoading(true)

        try {
            const db = await firebase.firestore();
            db.collection("drivers")
            .doc(data.ACCOUNT_CODE)
            .get()
            .then((doc) => {
                const data = doc.data();
                setTimeout(()=>{
                    setLoading(false)
                    window.sessionStorage.setItem('app',JSON.stringify(data))
                    dispatch(appSlice.actions.setData(data))
                    window.location.reload()
                },1000)
            });

        } catch (e) {
            console.log(e)
        }
    }

    const validate = () => {
        return CODES.includes(data.ACCOUNT_CODE)
    }

    return (
        <div className="login">
            <Modal
                size={'mini'}
                open={true}
            >
                <Image src={Logo} style={{paddingRight: '1rem', width: '80px', marginLeft: '1rem', marginTop: '1rem'}}></Image>
                <Modal.Header>
                Ninong Grab's Driver Portal
                </Modal.Header>
                <Dimmer.Dimmable as={Modal.Content} dimmed={loading}>
                    <Dimmer active={loading} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Form>
                        <Form.Field>
                        <label>Driver Code</label>
                        <input placeholder='Driver`s Code' name="pass" onChange={handlePassword} value={data.ACCOUNT_CODE} maxLength={6}/>
                        </Form.Field>
                        <Form.Field>
                        </Form.Field>
                        <Message
                            error={!err}
                            header={'Invalid Login'}
                            content='Please try again.'
                        />
                    </Form>
                </Dimmer.Dimmable>
                <Modal.Actions>
                <Button onClick={handleSubmitCreds} color='red' disabled={!validate()}>Login</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
}

export default Login