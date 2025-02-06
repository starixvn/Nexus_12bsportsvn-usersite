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
            stages: [{ name: LangHelper.getResource('Stage1'), value: 1 },
            { name: LangHelper.getResource('Stage2'), value: 2 }]
        };
    }

    handleChange = event => {
        const stage = parseInt(event.target.value, 10);
        this.setState({selectedStage: stage});
        if(this.props.votes[stage - 1] === undefined)
        {
            this.props.getVotes(stage);
        }
    };

    componentDidMount() {
        this.props.getMatches();
        this.props.getVotes(this.state.selectedStage);
    }

    render() {
        const { matches } = this.props;
        if (matches === null) {
            return null;
        }
        const votes =  this.props.votes[parseInt(this.state.selectedStage, 10) - 1];
        if(votes === undefined) {
            return null;
        }
        const showMatches = getMatchesByStage(matches, parseInt(this.state.selectedStage, 10));
        const countStageStanding = this.state.stages.filter(x => x.value <= parseInt(window.CountStageActive, 10));
        return (
            <>
            {
                (countStageStanding.length > 1 || (countStageStanding.length === 1 && votes.length > 0)) && <div className="standing-minigame">
                    <div className="minigame-section minigame-standing">
                        <div className="wraper-minigame-table">
                            <div className="minigame-title standing-title">
                                <div className="block-heading">
                                    <h2 className="block-heading-text">
                                        {LangHelper.getResource('StandingMinigame')}
                                    </h2>
                                </div>
                            </div>
                            <div className="minigame-standing-control">
                                <select value={parseInt(this.state.selectedStage, 10)}
                                    onChange={this.handleChange} className="custom-select">
                                    {
                                        countStageStanding.map(item =>
                                            <option key={item.value} value={item.value}>{item.name}</option>)
                                    }
                                </select>
                            </div>
                            <Standing matches={showMatches} votes={votes} stagesSelected={parseInt(this.state.selectedStage, 10)} />
                        </div>
                        <div className="img-table">
                            <img src="../../../../images/euro2024/minigame/item-table-1.png" alt="item" />
                        </div>
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