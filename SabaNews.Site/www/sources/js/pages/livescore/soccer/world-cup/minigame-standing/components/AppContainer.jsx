import { bindActionCreators } from 'redux';
import Standing from '../components/Standing';
import React, { Component } from 'react';
import { ActionCreators } from '../actions';
import { connect } from 'react-redux';
import { getMatchesByStage } from '../../common.functions';
import LangHelper from '@jsroot/common/langHelper';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStage: parseInt(window.CountStageActive, 10),
            stages:[{name:LangHelper.getResource('Stage1'), value:1},
            {name:LangHelper.getResource('Stage2'), value:2},
            {name:LangHelper.getResource('Stage3'), value:3},
            {name:LangHelper.getResource('Stage4'), value:4}]
        };
    }

    handleChange = event => {
        this.setState({
            selectedStage: event.target.value
        });
        this.props.getVotes(parseInt(event.target.value, 10));
    };

    componentDidMount() {
        this.props.getMatches();
        this.props.getVotes(this.state.selectedStage);
    }

    render() {
        const { matches, votes } = this.props;
        if(matches === null || votes === null) {
            return null;
        }
        const showMatches = getMatchesByStage(matches, parseInt(this.state.selectedStage, 10));
        const countStageStanding = this.state.stages.filter( x => x.value <= parseInt(window.CountStageActive, 10));
        return (
            <>
                {
                    (countStageStanding.length > 1 || countStageStanding.length === 1 && votes.length > 0) &&
                    <div className="minigame-section minigame-standing">
                        <div className="wraper-minigame-table">
                            <div className="minigame-title standing-title">
                                <h1 className="text">
                                    {LangHelper.getResource('StandingMinigame')}
                                </h1>
                                <div className="dots-parent">
                                    <ul className="dots">
                                        <li className="dots-small"></li>
                                        <li className="dots-regular"></li>
                                        <li className="dots-parent-center"></li>
                                        <li className="dots-regular"></li>
                                        <li className="dots-small"></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="minigame-standing-control">
                                <select value={parseInt(this.state.selectedStage, 10)}
                                    onChange={this.handleChange} className="custom-select">
                                    {
                                        countStageStanding.map( item =>
                                        <option key={item.value} value={item.value}>{item.name}</option> )
                                    }
                                </select>
                            </div>
                            <Standing matches={showMatches} votes={votes} stagesSelected={parseInt(this.state.selectedStage, 10)}/>
                        </div>
                        <div className="wave-standing-main"></div>
                        <div className="wave-standing-bg"></div>
                        <div className="section-icon">
                            <img src="../../../../css/images/icon_2.svg" alt="" />
                        </div>
                    </div>
                }
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, stages, league, votes } = state;
    return { matches, stages, league, votes };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);