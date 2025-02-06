import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import { groupMatchesByStage } from '../../common.functions';
import Stages from './Stages';

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
        if(matches === null ) {
            return null;
        }
        const stages = groupMatchesByStage(matches);
        return (
            <div className="minigame-stage">
                <Stages groupStages={stages}/>
                <div className="dock-stage-icon">
                    <img src="../../../../css/images/winner_sticker_4.gif" alt="" />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches } = state;
    return { matches};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);