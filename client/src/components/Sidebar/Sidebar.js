import React from 'react';
import { Link } from 'react-router-dom';

import avatar from '../../assets/img/avatar_03.png';


const Sidebar = () => {
    return (
        <div className="md:h-screen md:w-60 bg-white md:flex md:flex-col pl-9 md:pb-0 md:z-10 md:fixed top-0 left-0 md:mb-0 pb-5">
            <div className='w-24 mt-28'><img src={avatar} alt="avatar" /></div>
            <p className="mt-10 flex items-center"><a href="/dashboard"><span className="mr-2 text-2xl"><ion-icon name="stats-chart-outline"></ion-icon></span>Overview</a></p>
            <Link to="mypage" ><p className="mt-9 flex items-center"><span className="mr-2 text-2xl"><ion-icon name="person-circle-outline"></ion-icon></span>My Page</p></Link>
            <Link to="account"> <p className="mt-9"><a href="/#" className="flex items-center"><span className='mr-2 text-2xl'><ion-icon name="settings-outline"></ion-icon></span>Account</a></p></Link>
            <p className="mt-9 "><a href="/#" className="flex items-center"><span className='mr-2 text-2xl'><ion-icon name="exit-outline"></ion-icon></span>Logout</a></p>
        </div>
    )
}

export default Sidebar;