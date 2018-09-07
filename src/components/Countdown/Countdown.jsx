import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    challengedate: state.challengedate
});

class Countdown extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_STARTDATE'});
    }

    // triggerCountdown = () => {
    //     console.log(this.props.challengedate);
    //     // use a for loop and parse out YYYY, MM, DD
    //     let year = '';
    //     let month = '';
    //     let day = '';

    //     for (let i = 0; i < deadline.length; i++) {
    //         if (i === 0 || i === 1 || i === 2 || i === 3) {
    //             year = year + deadline[i];
    //         }
    //         if (i === 5 || i === 6) {
    //             month = month + deadline[i];
    //         }
    //         if (i === 8 || i === 9) {
    //             day = day + deadline[i];
    //         }
    //     }
    //     let monthCorrected = (parseInt(month, 10) - 1);
    //     month = monthCorrected.toString();
    //     let dateFormatted = new Date(year, month, day);
    //     this.initializeClock('clockdiv', dateFormatted);
    // }

    // initializeClock = (id, endDate) => {
    //     let clock = document.getElementById(id);
    //     let daysSpan = clock.querySelector('.days');
    //     let hoursSpan = clock.querySelector('.hours');
    //     let minutesSpan = clock.querySelector('.minutes');
    //     let secondsSpan = clock.querySelector('.seconds');

    //     function getTimeRemaining(endTime) {
    //         let total = Date.parse(endTime) - Date.parse(new Date());
    //         let seconds = Math.floor((total / 1000) % 60);
    //         let minutes = Math.floor((total / 1000 / 60) % 60);
    //         let hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    //         let days = Math.floor(total / (1000 * 60 * 60 * 24));
    //         return {
    //             'total': total,
    //             'days': days,
    //             'hours': hours,
    //             'minutes': minutes,
    //             'seconds': seconds
    //         };
    //     }

    //     function updateClock() {
    //         let endTime = getTimeRemaining(endDate);
    //         daysSpan.innerHTML = endTime.days;
    //         hoursSpan.innerHTML = ('0' + endTime.hours).slice(-2);
    //         minutesSpan.innerHTML = ('0' + endTime.minutes).slice(-2);
    //         secondsSpan.innerHTML = ('0' + endTime.seconds).slice(-2);
    //         if (endTime.total <= 0) {
    //             clearInterval(timeinterval);
    //         }
    //     }

    //     updateClock();
    //     let timeinterval = setInterval(updateClock, 1000);
    // }

    render() {
        // let date = this.props.challengedate.map((item, index)=>{
        //     return(
        //         <div key={index}>
        //             {item.date}
        //         </div>
        //     )
        // })
        // let dateArray = this.props.challengedate;
        // console.log('date array is: ',dateArray);
        // let dateItem = dateArray.map((item, index)=>{
        //     return(
        //         <div key={index}>
        //             {item.date}
        //         </div>
        //     )
        // })
        return (
            <main>
                <br />
                <section>
                    {/* {dateItem} */}
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
            </main >
        )
    }
}

export default connect(mapStateToProps)(Countdown);



