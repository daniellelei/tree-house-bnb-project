const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get all of the current user's bookings
router.get('/current',
requireAuth,
restoreUser,
async (req, res) =>{

    const allbookings = await Booking.findAll({
        where:{userId: req.user.id},
        include:Spot
    })
    return res.json({
        Bookings: allbookings
    })
    //need to include previewimage url

}
)

//edit a booking


router.put(
    '/:bookingId',
    requireAuth,
    restoreUser,

    async (req, res, next) => {
        const currentUserId = req.user.id;
        const {bookingId} = req.params;
        console.log(bookingId)
        const booking = await Booking.findOne({
            where:{id:bookingId},
            attributes:['userId', 'spotId']
        })
        
        //cannot find booking 
        if(!booking) {
            const err = new Error();
            err.status = 404;
            err.message =  "Booking couldn't be found";
            //return next(err)

            return res.status(404).json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }
        //belongs to current user?
        //let bookingJson = booking.toJson();
        let userId = booking.userId;
        if(currentUserId!==userId) {
            const err = new Error();
            return res.status(400).json({
                "message": "Not your booking",
                "statusCode": 400
            })
        }

        //body validation
        //is endDate on/before startDate
        const{startDate, endDate} = req.body;
        let newStart = new Date(startDate);
        let newEnd = new Date(endDate);
        //console.log(newStart, newEnd)
        let isStartDateSmaller = false;
        if(newStart.getTime()<newEnd.getTime()) {
            isStartDateSmaller = true;
        }
        if(!isStartDateSmaller) {
            const err = new Error();
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
        }

        //Can't edit a booking that's past the end date
        let currentDate = new Date();
        if(newEnd.getTime() < currentDate.getTime()){
            const err = new Error();
            return res.status(403).json({
                "message": "Past bookings can't be modified",
                "statusCode": 403
            })
        }

        //Booking conflict
        //find the spotId
        const spotId = booking.spotId
        
        const allbookings = await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['startDate', 'endDate']
        })
       

        for(let i = 0; i < allbookings.length; i++){
            let existedBooking = allbookings[i];
            let existedBookingJson = existedBooking.toJSON();
            let existedStart = existedBookingJson.startDate;
            let existedEnd = existedBookingJson.endDate;
            let newExistedStart = new Date(existedStart);
            let newExistedEnd = new Date(existedEnd);
            if(newStart.getTime() < newExistedStart.getTime()){
                if(newEnd.getTime()>newExistedStart.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }
            if(newStart.getTime() === newExistedStart.getTime()){
                const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
            }
            if(newStart.getTime() > newExistedStart.getTime()) {
                if(newStart.getTime()<newExistedEnd.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }

        }

        //no errors => edit a booking
        const currentBooking = await Booking.findOne({
            where: {id:bookingId}
        })
        
        const editBooking = await currentBooking.update({
            startDate,
            endDate,
        })

        return res.status(200).json(editBooking);
    }
)


// const bookingErrorHandler =  (err, req, res, next) =>{
//     if (err) {
//         res.status(err.status)
//         return res.json({
//             message: err.message,
//             statusCode: err.status,
//             errors: err.errors ? null : err.errors
//         })
//     }
//     next();
// }

//delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    restoreUser,
    async (req, res) => {
        
    }
)











module.exports = router;