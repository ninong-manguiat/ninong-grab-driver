import React, {useEffect, useState}from 'react';
import { Sidebar, Menu, Header, Icon, Label } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { PAGES, DRIVER_STATUS } from '../utils/constants';
import { useHistory } from "react-router-dom"

const SidebarComponent = ({
    children,
    visible,
    handleSideBar
}) => {
    const { data } = useSelector(getApp)
    const history = useHistory()

    const menu = [
        {
            text: 'Driver Profile',
            icon: 'id card',
            link: PAGES.PROFILE
        },
        {
            text: 'Trip',
            icon: 'car',
            link: PAGES.TRIP
        },
        {
            text: 'Trips',
            icon: 'car',
            link: PAGES.TRIPS
        }
    ]

    const handleLogout = () => {
        window.sessionStorage.removeItem('app')
        window.location.reload()
    }

    const renderMenu = () => {
        const jsx = menu.map((a,k)=>{
            return (
                <Menu.Item as='a' key={k} onClick={() => {
                    window.location.href=`${window.location.origin}${a.link}`
                }}>
                <Icon name={a.icon}/>{a.text}
                </Menu.Item>
            )
        })

        return jsx
    }

    const renderColorCard = (s) => {
        return s === DRIVER_STATUS.OFFLINE ? 'grey' : (
            s === DRIVER_STATUS.AVAILABLE ? 'green' : (
            s === DRIVER_STATUS.SCHEDULED ? 'red' : (
            s === DRIVER_STATUS.INTRANSIT ? 'blue' : 'black'
            )
        )
        )
    }

    const renderSideBar = () => {
        const { LAST_NAME, FIRST_NAME, PLATE_NO } = data.DRIVER_DETAILS

        return (
            <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            onHide={handleSideBar}
            vertical
            visible={visible}
            width='thin'
            className="sidebarx"
            style={{backgroundColor: '#B21D20'}}
            >
                <Header as='h4' icon textAlign='center' className="headtext">
                    <Header.Content>
                        {`${LAST_NAME}, ${FIRST_NAME}`}
                        <Header.Subheader style={{color: 'white'}}>
                            <i >{PLATE_NO}</i>
                        </Header.Subheader>
                        <Header.Subheader style={{marginLeft: '0rem', marginTop: '1rem'}}>
                            <Label color={renderColorCard(data.STATUS)}>
                                {data.STATUS}
                            </Label>
                        </Header.Subheader>
                    </Header.Content>
                </Header>

                {renderMenu()}

                <Menu.Item as='a' className="last" onClick={handleLogout}>
                <Icon name="sign-out"/>
                Logout
                </Menu.Item>
                
            </Sidebar>
        )
    }

    return (
        window.location.pathname !== PAGES.LOGIN ? (
            <Sidebar.Pushable>
            {renderSideBar()}
            <Sidebar.Pusher dimmed={visible} style={{height: '100vh'}}>
                {children}
            </Sidebar.Pusher>
            </Sidebar.Pushable> 
        ) : (<></>)
    )
}

export default SidebarComponent