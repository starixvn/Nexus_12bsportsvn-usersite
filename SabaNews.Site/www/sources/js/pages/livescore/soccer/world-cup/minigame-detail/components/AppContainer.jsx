import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Grid from './Grid';
export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getMatches();
        this.props.getVotes();
    }

    render() {
        const { matches, votes } = this.props;
        if(votes === null || matches === null) {
            return null;
        }
        return(
            <>
                <Grid matches={matches} votes={votes} />
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, votes } = state;
    return { matches, votes };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);