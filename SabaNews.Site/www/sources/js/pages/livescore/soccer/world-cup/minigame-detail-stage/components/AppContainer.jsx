import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Stages from './Stages';
import { groupMatchesByStage } from '../../common.functions';
export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getMatches();
        this.props.getVotes();
    }


    render() {
        const { matches } = this.props;
        if(matches === null) {
            return null;
        }
        const stages = groupMatchesByStage(matches);
        return (
            <Stages groupStages={stages} />
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches } = state;
    return { matches };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);