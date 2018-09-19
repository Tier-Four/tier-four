import React, { Component } from 'react';
import { connect } from 'react-redux';
import PastChallenges from '../PastChallenges/PastChallenges';
import CurrentChallenge from '../CurrentChallenge/CurrentChallenge';
import Header from '../Header/Header';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CHALLENGE_ACTIONS } from '../../redux/actions/challengeActions';
import {Tabs, Tab, Paper} from '@material-ui/core';

// allow local state to get redux store data
const mapStateToProps = state => ({
    user: state.user.user,
    login: state.login,
});

class AdminView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayCurrentChallenge: true,
            displayPastChallenges: false,
            value: 0,
        }
    }

    componentWillMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
        this.props.dispatch({ type: CHALLENGE_ACTIONS.FETCH_ACTIVE_CHALLENGE });
    }

    componentDidUpdate() {
        // checks if user is admin
        if (this.props.user === null || !this.props.user.admin) {
            this.props.history.push('/home');
        }
    }

    // line 38 to line 62 toggle component state values to either true or false
    // allowing view to display either current or past challenge data
    displayCurrentChallenge = () => {
        if (this.state.displayPastChallenges === true) {
            this.setState({
                displayPastChallenges: false
            })
        }
        if (this.state.displayCurrentChallenge === false) {
            this.setState({
                displayCurrentChallenge: true
            })
        }
    }

    displayPastChallenges = () => {
        if (this.state.displayCurrentChallenge === true) {
            this.setState({
                displayCurrentChallenge: false
            })
        }
        if (this.state.displayPastChallenges === false) {
            this.setState({
                displayPastChallenges: true
            })
        }
    }

    // enable material-ui tab feature
    handleDisplayChange = (event, value) => {
        this.setState({
            value: value
        })
    }

    render() {
        const { value, displayCurrentChallenge, displayPastChallenges } = this.state;
        let content = (
            <div>
                <Paper>
                <Tabs
                    style={{float:"right"}}
                    value={value}
                    indicatorColor="primary"
                    onChange={this.handleDisplayChange}>
                    <Tab
                        label="Current Challenge"
                        onClick={this.displayCurrentChallenge} />
                    <Tab
                        label="Past Challenges"
                        onClick={this.displayPastChallenges} />
                </Tabs>
                <div>
                    {displayPastChallenges && <PastChallenges />}
                </div>
                <div>
                    {displayCurrentChallenge && <CurrentChallenge />}
                </div>
                </Paper>
            </div>
        );
        return (
            <main>
                <Header />
                {content}
            </main>
        )
    }
}

export default connect(mapStateToProps)(AdminView);