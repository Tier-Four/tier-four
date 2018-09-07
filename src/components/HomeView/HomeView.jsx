import React, { Component } from 'react';
import Header from '../Header/Header';
import { fetchStartDate } from '../../redux/actions/countdownActions';
import { connect } from 'react-redux';
import axios from 'axios';
import LOGIN_ACTIONS from '../../redux/actions/loginActions'
import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
    challengeDate: state.challengeDate,
    user: state.user.user
});

class HomeView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            challengeDate: ''
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchStartDate()); 
    }
    


    componentWillMount() {
        this.props.dispatch({
            type: USER_ACTIONS.FETCH_USER
        })
    }
    

    logout = () => {
        // axios.get('/api/auth/logout').then(response => {
        //     alert('Logged out')
        // }).catch(err => {
        //     alert('error on logout', err)
        // })
        this.props.dispatch({type: LOGIN_ACTIONS.LOGOUT})
    }

    login = () => {
        this.props.dispatch({type: LOGIN_ACTIONS.LOGIN})
    }

    handleInputChange = (event) => {
        this.setState({
            challegeDate: event.target.value
        })
    }

    reqDotUser = () => {
        axios.get('/api/auth/profile').then(response => {
            console.log(response.data);

        }).catch(err => {
            console.log(err);
        })
        console.log('from REDUX, USER:', this.props.user.user);
        
    }

    startCountdown = () => {
        console.log(this.challengeDate);
        
        let deadline = this.challengeDate;        
        // use a for loop and parse out YYYY, MM, DD
        let year = '';
        let month = '';
        let day = '';

        for (let i = 0; i < deadline.length; i++) {
            if (i === 0 || i === 1 || i === 2 || i === 3) {
                year = year + deadline[i];
            }
            if (i === 5 || i === 6) {
                month = month + deadline[i];
            }
            if (i === 8 || i === 9) {
                day = day + deadline[i];
            }
        }
        let monthCorrected = (parseInt(month, 10) - 1);
        month = monthCorrected.toString();
        let dateFormatted = new Date(year, month, day);
        this.initializeClock('clockdiv', dateFormatted);
    }
    // ----------------------------------------------------------------------------------------

    initializeClock = (id, endDate) => {
        let clock = document.getElementById(id);
        let daysSpan = clock.querySelector('.days');
        let hoursSpan = clock.querySelector('.hours');
        let minutesSpan = clock.querySelector('.minutes');
        let secondsSpan = clock.querySelector('.seconds');

        function getTimeRemaining(endTime) {
            let total = Date.parse(endTime) - Date.parse(new Date());
            let seconds = Math.floor((total / 1000) % 60);
            let minutes = Math.floor((total / 1000 / 60) % 60);
            let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
            let days = Math.floor(total / (1000 * 60 * 60 * 24));
            return {
                'total': total,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function updateClock() {
            let endTime = getTimeRemaining(endDate);
            daysSpan.innerHTML = endTime.days;
            hoursSpan.innerHTML = ('0' + endTime.hours).slice(-2);
            minutesSpan.innerHTML = ('0' + endTime.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + endTime.seconds).slice(-2);
            if (endTime.total <= 0) {
                clearInterval(timeinterval);
            }
        }

        updateClock();
        let timeinterval = setInterval(updateClock, 1000);
    }

    render() {
        return (
            <main>
                <Header title="Tier Four" />
                <br />
                <section>
                    <h5>Sign up before next challenge!</h5>
                    <br />
                    <div id="clockdiv">
                        <div>
                            <span className="days"></span>
                            <div>Days</div>
                        </div>
                        <div>
                            <span className="hours"></span>
                            <div>Hours</div>
                        </div>
                        <div>
                            <span className="minutes"></span>
                            <div>Minutes</div>
                        </div>
                        <div>
                            <span className="seconds"></span>
                            <div>Seconds</div>
                        </div>
                    </div>
                </section>
                <img src="" />
                <button onClick={this.reqDotUser}>Log req.user</button>
                <button onClick={this.logout}>Log out</button>
                <button onClick={this.login}>Sign In</button>
                <a href="http://localhost:5000/api/auth/login">Log In</a>
            </main >
        )
    }
}

export default connect(mapStateToProps)(HomeView);



