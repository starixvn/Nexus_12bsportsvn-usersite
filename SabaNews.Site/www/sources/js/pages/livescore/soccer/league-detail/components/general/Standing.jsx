import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';
import Grid from '../standings/grid/index';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';

export class Standing extends PureComponent {
    constructor(props) {
        super(props);

        this.MobileMaxWidth = 580;
        this.state = {
            isMobile: window.innerWidth <= this.MobileMaxWidth ? true : false,
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= this.MobileMaxWidth) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > this.MobileMaxWidth) {
                this.setState({ isMobile: false });
            }
        }
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);

        this.props.getSeasonStandings({
            leagueId: window.getMatchByStageParams.leagueId,
            seasonId: window.getMatchByStageParams.seasonId
        });
    }

    groupStandingsByGroupName = seasonStandings => {
        const totalItems = seasonStandings.length;
        const standings = [];
        for (let i = 0; i < totalItems; i++) {
            const temp = seasonStandings[i];
            const key = temp.groupName;
            const item = {
                key,
                childs: [temp]
            };
            if (standings.length === 0) {
                standings.push(item);
            } else {
                const index = standings.findIndex(x => x.key === key);
                if (index === - 1) {
                    standings.push(item);
                } else {
                    standings[index].childs.push(temp);
                }
            }
        }

        return standings;
    };

    groupStandingsByStage = seasonStandings => {
        if(seasonStandings.length === 0) {
            return [];
        }
        let totalItems = seasonStandings.length;
        const standings = [];
        for (let i = 0; i < totalItems; i++) {
            const temp = { ...seasonStandings[i] };
            temp.promotion = JSON.parse(temp.promotion);
            temp.promotion = temp.promotion && temp.promotion.Color ? temp.promotion : null;
            const item = {
                stageId: temp.stageId,
                stageNameEN: temp.stageNameEN,
                stageNameVN: temp.stageNameVN,
                orderIndex: temp.orderIndex,
                childs: [temp]
            };
            if (standings.length === 0) {
                standings.push(item);
            } else {
                const index = standings.findIndex(x => x.stageId === temp.stageId);
                if (index === - 1) {
                    standings.push(item);
                } else {
                    standings[index].childs.push(temp);
                }
            }
        }
        let standing = standings[standings.length - 1];
        standing.childs = this.groupStandingsByGroupName(standing.childs);
        const lengthChild = standing.childs.length;
        if(standing.childs.length === 1) {
            if(standing.childs[0].childs.length > 5) {
                standing.childs[0].childs = standing.childs[0].childs.slice(0, 5);
            }
        } else {
            standing.childs = standing.childs.slice(0, 1);
        }
        return {standing, length: standings.length, lengthChild};
    };

    render() {
        const seasonStanding = this.groupStandingsByStage(this.props.seasonStandings);
        const isMobile = this.state.isMobile;
        return (
            <div>
                {
                    <div className="season-standings">
                        <div className="heading-general-league">{LangHelper.getResource('Standing')}</div>
                        <div>
                            { seasonStanding.length > 1 && <div className="group-stage">{CommonFunctions.getStageName(seasonStanding.standing)}</div>}
                            { seasonStanding.length > 0 && <Grid standings={seasonStanding.standing.childs} isMobile={isMobile} isCup={seasonStanding.lengthChild > 1 } />}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { seasonStandings } = state;
    return { seasonStandings };
};

export default connect(mapStateToProps, mapDispatchToProps)(Standing);