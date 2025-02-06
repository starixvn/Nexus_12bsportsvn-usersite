import React, { PureComponent } from 'react';
import dayjs from 'dayjs';
import LangHelper from '@jsroot/common/langHelper';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MatchStatus } from '@jsroot/common/constants';

export default class MatchStage extends PureComponent {
    constructor(props) {
        super(props);

        this.intervalId = null;

        this.state = {
            stage: '',
            className: ''
        };
    }

    componentDidMount() {
        this.getMatchStage();
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match !== this.props.match) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            this.getMatchStage();
        }
    }

    getMatchStageOfLiveMatch = match => {
        let stage;
        switch (match.status) {
            case MatchStatus.FirstHalf:
                this.intervalId = setInterval(() => this.setState({ stage: this.getFirstHalfTimeMinutes(match) }), 1000 * 60);
                stage = this.getFirstHalfTimeMinutes(match);
                break;

            case MatchStatus.SecondHalf:
                this.intervalId = setInterval(() => this.setState({ stage: this.getSecondHalfTimeMinutes(match) }), 1000 * 60);
                stage = this.getSecondHalfTimeMinutes(match);
                break;

            case MatchStatus.ExtraTime:
                this.intervalId = setInterval(() => this.setState({ stage: this.getExtraTimeMinutes(match) }), 1000 * 60);
                stage = this.getExtraTimeMinutes(match);
                break;

            case MatchStatus.Intermission:
                stage = LangHelper.getResource('Intermission');
                break;

            case MatchStatus.PenaltyShootout:
                stage = LangHelper.getResource('Penalty');
                break;

            default:
                stage = '';
                break;
        }

        return stage;
    };

    getMatchStageOfPreAndPostMatch = match => {
        let stage = '';
        switch (match.status) {
            case MatchStatus.NotStarted:
                const startTime = DateTimeService.convertFromUTC(match.startTime);
                stage = DateTimeService.toShortTimeFormat(startTime);
                break;

            case MatchStatus.Delay:
                stage = LangHelper.getResource('Delay');
                break;

            case MatchStatus.Interrupt:
                stage = LangHelper.getResource('Interrupt');
                break;

            case MatchStatus.Postpone:
                stage = LangHelper.getResource('Postponed');
                break;

            case MatchStatus.Cancel:
                stage = LangHelper.getResource('Cancel');
                break;

            case MatchStatus.TBD:
                stage = LangHelper.getResource('ToBeDecided');
                break;
            case MatchStatus.CutInHalf:
                stage = LangHelper.getResource('CutInHalf');
                break;
            default:
                stage = LangHelper.getResource('Finish');
                break;
        }

        return stage;
    };

    getMatchStage = () => {
        const match = this.props.match;
        const className = match.status === MatchStatus.NotStarted ? 'font-weight-bold' : '';
        let stage = '';
        switch (match.status) {
            case MatchStatus.FirstHalf:
            case MatchStatus.SecondHalf:
            case MatchStatus.ExtraTime:
            case MatchStatus.Intermission:
            case MatchStatus.PenaltyShootout:
                stage = this.getMatchStageOfLiveMatch(match);
                break;
            default:
                stage = this.getMatchStageOfPreAndPostMatch(match);
                break;
        }

        this.setState({ stage, className });
    };

    getFirstHalfTimeMinutes = match => {
        const startTime = match.footballStartTime
            ? dayjs(DateTimeService.convertFromUTC(match.footballStartTime))
            : dayjs(DateTimeService.convertFromUTC(match.startTime));
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        let minutes = currentTime.diff(startTime, 'minutes');
        minutes = minutes < 0 ? 0 : minutes;
        return minutes <= 45 ? `${minutes}'` : `45'+`;
    };

    getSecondHalfTimeMinutes = match => {
        const startTime = match.footballNextHalfStartTime
            ? dayjs(DateTimeService.convertFromUTC(match.footballNextHalfStartTime))
            : dayjs(DateTimeService.convertFromUTC(match.startTime)).add(1, 'hours');
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        let minutes = currentTime.diff(startTime, 'minutes');
        minutes = minutes < 0 ? 0 : minutes;
        return minutes <= 45 ? `${45 + minutes}'` : `90'+`;
    };

    getExtraTimeMinutes = match => {
        const startTime = match.footballAddStartTime
            ? dayjs(DateTimeService.convertFromUTC(match.footballAddStartTime))
            : dayjs(DateTimeService.convertFromUTC(match.startTime)).add(2, 'hours');
        const currentTime = dayjs(DateTimeService.getCurrentClientDateTime());
        const minutes = currentTime.diff(startTime, 'minutes') + 90;
        return minutes <= 120 ? `${minutes}'` : `120'+`;
    };

    render() {
        const { stage, className } = this.state;
        return (
            <div className="soccer-match-stage"><span className={className}>{stage}</span></div>
        );
    }
}