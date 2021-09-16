import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import TaoyuanAirport from './Images/TaoyuanAirport.png'
import clock from './Images/clock-svgrepo-com.svg'
import airplane from './Images/airplane-svgrepo-com.svg'
import airport from './Images/airport-svgrepo-com.svg'
import map from './Images/map-svgrepo-com.svg'
import weather from './Images/sun-weather-svgrepo-com.svg'
import passport from './Images/passport-svgrepo-com.svg'
import { Button, } from "react-bootstrap";

class Home extends React.Component {
    render() {
        return (
            <div>
                <div className="App-header">
                    <img src={TaoyuanAirport}></img>
                </div>
                <div className="buttonlist">
                        <Link className="button realtime" to="/Page1/" >
                            <img className="icon" src={clock}></img>
                            <div>
                                <span className="btntitle">Real-time</span><br />
                                <span>Search your flight information here</span>
                            </div>
                        </Link>
                        <Link className="button flightinfo" to="/" >
                            <img className="icon" src={airplane}></img>
                            <div>
                                <span>Flight Info</span><br />
                                <span>Your upcoming flight</span>
                            </div>
                        </Link>
                        <Link className="button checkininfo" to="/" >
                            <img className="icon" src={passport}></img>
                            <div>
                                <span>Check-in<br />Info</span><br />
                                <span>Your upcoming flight</span>
                            </div>
                        </Link>
                        <Link className="button terminal" to="/" >
                            <img className="icon" src={airport}></img>
                            <div>
                                <span className="btntitle">Terminal</span><br />
                                <span>Find your terminal here</span>
                            </div>
                        </Link>
                        <Link className="button maps" to="/" >
                            <img className="icon" src={map}></img>
                            <div>
                                <span>Maps</span><br />
                                <span>Explore Taoyuan Airport</span>
                            </div>
                        </Link>
                        <Link className="button weather" to="/" >
                            <img className="icon" src={weather}></img>
                            <div>
                                <span>Weather</span><br />
                                <span>How's the weather today</span>
                            </div>
                        </Link>
                    
                   
                </div>
            </div>
        );
    }
}

export default Home;