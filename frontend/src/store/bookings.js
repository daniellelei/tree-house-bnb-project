import {csrfFetch} from './csrf';
import Cookies from 'js-cookie';

const LOAD_CURRENT_BOOKINGS = 'bookings/loadCurrentBookings'
const LOAD_SPOT_BOOKINGS = 'bookings/loadSpotBookings'
const ADD_BOOKING = 'bookings/addBooking'
const EDIT_BOOKING = 'bookings/editBooking'
const DELETE_BOOKING = 'bookings/deleteBooking'

const CLEAR_CURRENT_BOOKINGS = 'bookings/ClearCurrentBookings'
const CLEAR_SPOT_BOOKINGS = 'booking/ClearSpotBookings'

export const actionGetCurrentBookings = (bookings) => {
    return {
        type: LOAD_CURRENT_BOOKINGS,
        bookings
    }
}

export const actionGetSpotBookings = (bookings) => {
    return {
        type: LOAD_SPOT_BOOKINGS,
        bookings
    }
}

export const actionClearCurrentBookings = () => {
    return {
        type:CLEAR_CURRENT_BOOKINGS
    }
}
export const actionClearSpotBookings = () => {
    return {
        type: CLEAR_SPOT_BOOKINGS
    }
}



export const thunkGetCurrentBookings = () => async (dispatch) =>{
    const response = await csrfFetch(`/api/bookings/current`)
    if (response.ok) {
        const bookingsRes = await response.json();
        await dispatch(actionGetCurrentBookings(bookingsRes.Bookings))
    }
}

export const thunkGetSpotBookings = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}/bookings`)
    if (response.ok) {
        const bookingRes = await response.json();
        await dispatch(actionGetSpotBookings(bookingRes.Bookings))
    }
}

const initialState = {
    currentBookings:{},
    spotBookings:{}
}

const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CURRENT_BOOKINGS:
            const allBookings = {};
            action.bookings.forEach((booking)=>{
                allBookings[booking.id] = booking;
            })
            return {...state, currentBookings: {...allBookings}}
        case LOAD_SPOT_BOOKINGS:
            const allSpotBookings = {};
            action.bookings.forEach((booking)=>{
                allSpotBookings[booking.id] = booking;
            })
            return {...state, spotBookings: {...allSpotBookings}}
        case CLEAR_CURRENT_BOOKINGS:
            return{...state, currentBookings:{}}
        case CLEAR_SPOT_BOOKINGS:
            return {...state, spotBookings:{}}

        default:
            return state;
    }
}
export default bookingsReducer;