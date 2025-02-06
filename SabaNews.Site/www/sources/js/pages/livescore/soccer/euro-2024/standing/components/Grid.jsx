import React, { PureComponent } from 'react';
import Item from './Item';
import CommonFunctions from '@jsroot/common/common-functions';


export default class Grid extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: this.initActiveTab()
        };
    }

    initActiveTab = () => {
        const { matches } = this.props;
        const notStartStageIndex = matches.findIndex(item => item.isFinished === false);
        let stageId;
        if(notStartStageIndex < 0) {
            stageId = matches.length - 1;
        } else {
            stageId = notStartStageIndex;
        }
        return stageId;
    };

    handleActiveTab = isNext => {
        const matches = this.props.matches;
        const activeIndex = this.state.activeIndex;
        const currentIndex = isNext ? activeIndex + 1 : activeIndex - 1;
        if((isNext && currentIndex < matches.length) || (!isNext && currentIndex >= 0))  {
            this.setState({activeIndex: currentIndex});
        }
    };

    render() {
        const { matches, isMobile, thirdPlace} = this.props;
        const { activeIndex } = this.state;
        return (
            <div className="draw" style={{transform: `${isMobile ? `translateX(-${activeIndex}00%)` : 'none'}`}}>
                {
                    matches.map((item, index) => {
                        let first = '';
                        let last = '';
                        if(index === 0) {
                            first = 'draw__round--first';
                        }
                        if(index === matches.length - 1) {
                            last = 'draw__round--last';
                        }
                        return (
                            <div className={`draw__round ${first} ${last}`}  key={item.key}>
                                <div className="draw__header">
                                    <i className="draw__arrow draw__arrow--previous icon-livescore icon-chevron-left" onClick={() => this.handleActiveTab(false)}/>
                                    <div className="draw__label">{CommonFunctions.getStageName(item.stage)}</div>
                                    <i className="draw__arrow draw__arrow--next icon-livescore icon-chevron-right" onClick={() => this.handleActiveTab(true)} />
                                </div>
                                <div className="draw__brackets">
                                    {
                                        item.matches.map((match, matchIndex) => {
                                            const positionClass = (matchIndex + 1) % 2 ? 'draw__bracket--odd': 'draw__bracket--even';
                                            return (
                                                <Item match={match} positionClass={positionClass} key={matchIndex} index={matchIndex}/>
                                            );
                                        })
                                    }
                                    {
                                    index === matches.length - 1 && thirdPlace && thirdPlace.matchId &&
                                    <div className="draw__bracket draw__bracket--odd bracket-final">
                                        <div className="draw__final--header">tranh hạng 3</div>
                                        <Item match={thirdPlace} positionClass={'draw__bracket--odd'}  index={2}/>
                                    </div>
                                }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}