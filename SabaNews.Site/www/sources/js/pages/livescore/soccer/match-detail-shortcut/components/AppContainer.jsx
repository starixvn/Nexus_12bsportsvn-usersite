import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MatchInfo from './MatchInfo';
import SignalR from './SignalR';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getMatchDetail();
    }


    render() {
        const { match, incidents } = this.props;
        return (
            <>
                <SignalR />
                { match !== null && incidents !== null && <MatchInfo match={match} incidents={incidents} /> }
            </>
        );
    }

}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match, incidents } = state;
    return { match, incidents };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);