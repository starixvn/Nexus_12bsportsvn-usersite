import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Stage from './Stage';
import MobileStage from './MobileStage';
import { MobileMaxWidth } from '@jsroot/common/constants';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= MobileMaxWidth ? true : false,
            selectedStageId: this.initStageId()
        };
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= MobileMaxWidth) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > MobileMaxWidth) {
                this.setState({ isMobile: false });
            }
        }
    };

    initStageId = () => {
        const { league, stages } = this.props;
        const notStartStage = stages.find(item => !item.isFinished);
        let stageId;
        const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs(DateTimeService.convertFromUTC(league.season.endTime)).format('YYYY-MM-DD HH:mm:ss');
        if(!notStartStage || dayjs(today).isSameOrAfter(endTime)) {
            stageId = stages[stages.length - 1].key;
        } else {
            stageId = notStartStage.key;
        }
        return stageId;
    };
    onSetStageId = key => {
        this.setState({selectedStageId: key});
    };

    render() {
        const { stages } = this.props;
        const { isMobile, selectedStageId } = this.state;
        return (
            <div className="livescore-soccer">
                <div className="livescore-soccer-main" >
                    {
                        !isMobile &&
                        <Stage stages={stages} selectedStageId={selectedStageId} onSetStageId={this.onSetStageId} />
                    }
                    {
                        isMobile &&
                        <MobileStage stages={stages} selectedStageId={selectedStageId} onSetStageId={this.onSetStageId} />
                    }
                </div>
            </div>
        );
    }

}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, league } = state;
    return { matches, league };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);