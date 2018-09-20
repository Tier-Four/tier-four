import React, { Component } from 'react';
import { connect } from 'react-redux';
import { USER_ACTIONS } from '../../redux/actions/userActions';
import { CHALLENGE_ACTIONS } from '../../redux/actions/challengeActions';
import PastChallengesTable from '../PastChallengesTable/PastChallengesTable';

const mapStateToProps = state => ({
    activeChallenges: state.challenge.past
});

class PastChallenges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowsPerPage: 5,
            page: 0,
        }
    }
    componentWillMount() {
        this.props.dispatch({ type: CHALLENGE_ACTIONS.FETCH_PAST_CHALLENGES });
        this.props.dispatch({
            type: USER_ACTIONS.FETCH_USER
        })
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    }

    render() {
        return (
            <div>
                <br/><br /><br/><br />
                <PastChallengesTable />
            </div>
        )
    }
}


export default connect(mapStateToProps)(PastChallenges);