import React from 'react';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import STLogo from '../assets/img/swarslogo.png';
import Sound from 'react-sound';
import homeSong from '../assets/audio/staudiobeginning.mp3';


const Home = () => (
    
    <Fragment>
        <Helmet><title>SW Quiz - Home</title></Helmet>
        <div id="home">
        <Sound
                url={homeSong}
                playStatus="PLAYING"
                loop={true} 
                />
            <section>
                <div className='quizNameHome'>
                    <img src={STLogo} alt="Logo" className="logo" />
                </div>
                <div className='playButtonContainer'>
                    <Link className='playButton' to='/play/quiz'>Begin Your Path</Link>
                </div>
            </section>
        </div>
    </Fragment>
    
);

export default Home;