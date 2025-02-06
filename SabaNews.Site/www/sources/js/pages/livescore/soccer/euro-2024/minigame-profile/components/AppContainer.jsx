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
        this.props.getProfileData();
    }

    render() {
        const { matches, votes, statusStages } = this.props;
        if(votes === null || matches === null) {
            return null;
        }
        return(
            <>
                <Grid matches={matches} votes={votes}  statusStages={statusStages} />
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, votes, statusStages } = state;
    return { matches, votes, statusStages };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);