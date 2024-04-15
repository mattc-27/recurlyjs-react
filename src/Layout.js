import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();

    const [isSolidBackground, setIsSolidBackground] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            // Adjust the scroll threshold based on your design
            const scrollThreshold = 100;
            // Check if the user has scrolled beyond the threshold
            setIsSolidBackground(window.scrollY > scrollThreshold);
            setLinkLight(window.scrollY > scrollThreshold);
        };
        // Add a scroll event listener
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <header className={isSolidBackground ? 'solid-background' : 'transparent-background'}
            >
                <div className='header-content'>
                    <div className='header-title header-img'>
                        <Link className='header-title' to={'/'}>
                            <h1 className='headerLink'>Recurly.js + React</h1>
                        </Link>
                    </div>
                    <div className='header-nav'>
                        <Link
                            className={isSolidBackground ? 'light-text' : 'dark-text'} to={'/select-plan'}>Plans | Checkout demo</Link>

                    </div>

                </div>
            </header>

            <Outlet />
        </>
    );
}