// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const clickCreate = (e) => {
        e.preventDefault();
    }

  return (
    <ul className='headNav'>
      <li className='home'>
        <NavLink style={{textDecoration: 'none'}} exact to="/">
          <div className='iconName'>
            <img className='icon' src='https://cdn-icons-png.flaticon.com/128/3281/3281223.png'/>
            <h4 className='apiName'>tree house bnb</h4>
          </div>
          {/* <i class="fa-solid fa-house"></i> */}
        </NavLink>
      </li>
      <div className='navRight'>
      {sessionUser ?
      (
        <button onClick={clickCreate} className='createSpot'>
          <NavLink exact to='/spots/new' className='createSpotLink'>Create a New Spot
          </NavLink>
        </button>
      
      ) : (null)}
      {isLoaded && (
        <div className='profileButton'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      </div>
      
    </ul>
  );
}

export default Navigation;