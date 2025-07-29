
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
        DRIVER_DETAILS: {
            UID: '',
            CONTACT_NO: '',
            DRIVER_CODE: '',
            EMAIL: '',
            FIRST_NAME: '',
            LAST_NAME: '',
            MIDDLE_NAME: '',
            IMG: '',
            PASSWORD: '',
            PLATE_NO: '',
            STATUS: ''
        },
        ACCOUNT_CODE: '',
        STATUS: '',
        TRIP: ''
    }
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setData: (state, action) => ({ ...state, data: action.payload }),
    }
})

export const getApp = (state) => state.app;
export default appSlice;
