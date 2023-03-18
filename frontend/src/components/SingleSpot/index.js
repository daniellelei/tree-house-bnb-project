import { useParams } from "react-router-dom";
import './SingleSpot.css';
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpotThunk } from "../../store/spots";
import { loadReviewThunk } from "../../store/reviews";
import { useEffect } from "react";
import DeleteModal from '../DeleteSpotModal';
import OpenModalButton from '../OpenModalButton/index'
import CreateReviewModal from "../CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal";


const SingleSpot = () => {
    const { spotId }  = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state=>state.spots.singleSpot);
    let reviews = useSelector(state => state.reviews.reviews);
    let user = useSelector(state=>state.session.user);
    reviews = Object.values(reviews);//array
    //console.log('reviews', reviews)

    

    const displayPostReviewButton = (user, reviews, spot) => {
        if( user===null || user===undefined ) return false;

        for( let r of reviews){
            if(r.userId === user.id)
            return false;
        }
        if(user.id === spot.ownerId) return false;

        return true;
    }
    const displayFirstReview = (user, reviews, spot) => {
        if( user===null || user===undefined ) return false;
        if(Boolean(reviews.length)) return false;
        if(user.id === spot.ownerId) return false;
        return true;

    }
    const displayDelReviewButton = (user, review) => {
        if( user===null || user===undefined ) return false;
        if (user.id === review.userId) return true;
        return false;
    }

    
    useEffect(()=>{
        dispatch(loadOneSpotThunk(spotId));
        dispatch(loadReviewThunk(spotId));
    }, [dispatch])
    if(!spot) return null;

    const clickReserve = (e) => {
        e.preventDefault();
        window.alert('Feature Coming Soon')
    }

    const imagesRender = (images) => {
        for (let i=0; i<images.length; i++){
            images[i].ind = `img${i}`
        }
        return images;
    }
    let images = spot.SpotImages;
    images = imagesRender(images);

    const reviewNum = (num) => {
        if(num === 1 ) return ` 1 review`
        else return ` ${num} reviews`
    }

    const reviewMonthYear = (moment) => {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let created = new Date(moment);
        let result = `${months[created.getMonth()]} ${created.getFullYear()}`
        return result;
    }

    
    
    return (
        <div className="wholePage">
            <div className="singleSpot">
                <h1 className="spotName">{spot.name}</h1>
                <div className="locationInfo">
                    <span>{spot.city}, {spot.state}, {spot.country} </span> 
                </div>
                <div className="images">
                    {images.map((image) => (
                        <img key={image.id} className={image.ind} src={image.url} />
                    ))}

                   
                </div>
                <div className="belowImage">
                    <div className="details">
                        <span>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</span>
                        <p>{spot.description}</p>
                    </div>
                    <div className="callOut">
                        <div className="price">
                            <p>${spot.price} night</p>
                            <p>
                                {spot.avgStarRating==='No reviews yet' ? 
                                <h4> New </h4> : 
                                (<div className='ratingStar'>
                                    <i class="fa-sharp fa-solid fa-star"></i>
                                    <h4 className='spotRate'>{Number.parseFloat(spot.avgStarRating).toFixed(1)}</h4>
                                    <h4> · </h4>
                                    <h4>{reviewNum(spot.numReviews)}</h4>
                                    
                                </div>)}
                            </p>
                            
                            {/* <p>{spot.avgStarRating}<i class="fa-sharp fa-solid fa-star"></i>  {spot.numReviews}reviews</p> */}
                        </div>
                        <button onClick={clickReserve} className="reserve">Reserve</button>
                    </div>
                </div>

                <div className="reviews">
                    <div>
                        {displayFirstReview (user, reviews, spot) ? 
                        <h4>Be the first to post a review!</h4> : null
                        }
                        {displayPostReviewButton(user, reviews, spot) ? 
                        <OpenModalButton 
                            buttonText= 'Post a review'
                            modalComponent={<CreateReviewModal spot={spot}/>}
                        /> : null
                        }

                    </div>
                    {reviews.map((review)=> (
                        <div>
                            <h4>{review.User.firstName}</h4>
                            <h4>{reviewMonthYear(review.createdAt)}</h4>
                            <p>{review.review}</p>
                            {displayDelReviewButton(user, review) ? 
                            <OpenModalButton 
                                buttonText= 'Delete'
                                modalComponent={<DeleteReviewModal review={review} spotId={spotId} />}
                            /> : null
                            }
                            
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    )

}

export default SingleSpot;