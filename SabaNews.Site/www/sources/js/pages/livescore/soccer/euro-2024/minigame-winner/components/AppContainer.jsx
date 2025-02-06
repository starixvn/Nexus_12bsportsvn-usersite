import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import LangHelper from '@jsroot/common/langHelper';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { getMatchesByStage } from '../../common.functions';
import { MobileMaxWidth } from '@jsroot/common/constants';
import Winner from './Winner';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false,
            stages:[{name:LangHelper.getResource('Stage1'), value:1},
            {name:LangHelper.getResource('Stage2'), value:2}],
            selectedStage: parseInt(window.CountStageEnd, 10)
        };
    }

    componentDidMount() {
        this.props.getMatches();
        this.props.getVotes(this.state.selectedStage);
        window.stage = this.state.selectedStage;
    }

    handleChange = stage => {
        if(stage !== this.state.selectedStage){
            this.setState({ selectedStage: stage });
            if(this.props.votes[stage - 1] === undefined)
            {
                this.props.getVotes(stage);
            }
        }
    };

    handleChangeSelect = event => {
        const stage = parseInt(event.target.value, 10);
        this.setState({ selectedStage: stage });
        if(this.props.votes[stage - 1] === undefined)
        {
            this.props.getVotes(stage);
        }
    };

    render() {
        const { matches } = this.props;
        const { isMobile } = this.state;
        const activeStage = parseInt(this.state.selectedStage, 10);
        if(matches === null) {
            return null;
        }
        const votes =  this.props.votes[activeStage - 1];
        if(votes === undefined) {
            return null;
        }
        const countStageWinners =this.state.stages.filter( x => x.value <= parseInt(window.CountStageEnd, 10));
        const showMatches = getMatchesByStage(matches, activeStage);
        return (
            <>
                {
                    countStageWinners.length > 0 && <div className="winner-minigame">
                        <div className="minigame-winner minigame-section">
                            <div className="wraper-minigame-table">
                                <div className="block-heading">
                                    <h2 className="block-heading-text">
                                        {LangHelper.getResource('WinnersMinigame')}
                                    </h2>
                                </div>
                                <div className="minigame-control">
                                    {
                                        !isMobile && countStageWinners.map( item =>
                                            <button key={item.value} className= {parseInt(this.state.selectedStage, 10) === item.value ? 'buttonStage active'
                                            : 'buttonStage'} onClick={() => this.handleChange(item.value)}>{item.name}</button>
                                        )
                                    }
                                    {
                                        isMobile &&
                                        <select value={parseInt(this.state.selectedStage, 10)}
                                            onChange={this.handleChangeSelect} className="custom-select">
                                            {
                                                countStageWinners.map(index =>
                                                <option key={index.value} value={index.value}>{index.name}</option>)
                                            }
                                        </select>
                                    }
                                </div>
                                <Winner matches={showMatches} votes={votes} selectedStage={this.state.selectedStage} />
                            </div>
                            <div className="img-table">
                                <img src="../../../../images/euro2024/minigame/item-table-2.png" alt="item" />
                            </div>
                        </div>
                    </div>
                }
                <div className="line-winner show-pc">
                    <img src="../../../../images/euro2024/minigame/winner-line.png" alt="line" className="img-res"/>
                </div>
                <div className="line-winner show-mobile">
                    <img src="../../../../images/euro2024/minigame/winner-line-mobile.png" alt="line" className="img-res"/>
                </div>
                <div className="effect-winner">
                    <img src="../../../../images/euro2024/minigame/effect.png" alt="line"/>
                </div>
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