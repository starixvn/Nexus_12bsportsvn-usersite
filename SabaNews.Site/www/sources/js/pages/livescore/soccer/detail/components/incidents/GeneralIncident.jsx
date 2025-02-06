import React, { Component } from 'react';
import { IncidentPosition, IncidentStatus } from '@jsroot/common/constants';
import  IncidentIcon from '@jsroot/components/Icon/IncidentIcon';
import CommonFunctions from '@jsroot/common/common-functions';

export default class GeneralIncident extends Component {
    checkIncidentTypeToShowScore = type => type === IncidentStatus.Halftime
        || type === IncidentStatus.Penalty
        || type === IncidentStatus.Goal
        || type === IncidentStatus.OwnGoal;

    getBorder = (incident, position) => {
        let style = null;
        if (incident.position !== IncidentPosition.Home && position === IncidentPosition.Home) {
            style = { borderRight: 'none' };
        } else if (incident.position !== IncidentPosition.Away && position === IncidentPosition.Away) {
            style = { borderLeft: 'none' };
        }

        return style;
    };

    renderSubsitution = () => {
        const { incident } = this.props;
        return (
            <div className="line-up-live">
                <div className="line-up-live-item flexbox ">
                    <div className="inner-item-db flexbox item-th-home" style={this.getBorder(incident, IncidentPosition.Home)}>
                        {
                            incident.position === IncidentPosition.Home &&
                            <>
                                <div className="item-th-time">{incident.timeShow !== '' ? incident.timeShow + "'" : ''}</div>
                                <div className="item-th flexbox">
                                    <i className="in-out-icon icon-livescore icon-in"/>
                                    <span className="name-th">{incident.inPlayerName} <span className="noted"></span></span>
                                </div>
                                <div className="item-th flexbox">
                                    <i className="in-out-icon icon-livescore icon-out" />
                                    <span className="name-th">{incident.outPlayerName}<span className="noted"></span></span>
                                </div>
                            </>
                        }
                    </div>
                    <div className="item-mins flexbox">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7715 3.29L17.0615 1H9.06148V9L11.3615 6.7C13.3315 8.16 14.6115 10.48 14.6115 13.12C14.6115 14.43 14.2915
                            15.66 13.7315 16.75C16.0615 15.23 17.6115 12.61 17.6115 9.62C17.6115 7.1 16.5015 4.85 14.7715 3.29Z" fill="#319C2F" />
                            <path d="M5.52148 6.88C5.52148 5.57 5.84148 4.34 6.40148 3.25C4.06148 4.77 2.52148 7.39 2.52148 10.38C2.52148 12.9
                            3.62148 15.15 5.36148 16.71L3.06148 19H11.0615V11L8.76148 13.3C6.80148 11.84 5.52148 9.52 5.52148 6.88Z" fill="#E94633" />
                        </svg>
                    </div>
                    <div className="inner-item-db flexbox item-th-away" style={this.getBorder(incident, IncidentPosition.Away)}>
                        {
                            incident.position === IncidentPosition.Away &&
                            <>
                                <div className="item-th-time">{incident.timeShow !== '' ? incident.timeShow + "'" : ''}</div>
                                <div className="item-th flexbox">
                                    <span className="name-th">{incident.inPlayerName} <span className="noted"></span></span>
                                    <i className="in-out-icon icon-livescore icon-in" />
                                </div>
                                <div className="item-th flexbox">
                                    <span className="name-th">{incident.outPlayerName}<span className="noted"></span></span>
                                    <i className="in-out-icon icon-livescore icon-out" />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    };

    renderGeneral = () =>  {
        const { incident } = this.props;
        const processScore = `${incident.homeScore} - ${incident.awayScore}`;
        return (
            <div className="line-up-live">
                <div className="line-up-live-item flexbox">
                    <div className="inner-item-db flexbox item-th-home" style={this.getBorder(incident, IncidentPosition.Home)}>
                        {
                            incident.position === IncidentPosition.Home &&
                            <ul className="item-th flexbox">
                                <li className="item-th-time">{this.getIncidentTimeShow(incident.timeShow)}</li>
                                <li>
                                    <span className="item-th-name">
                                        {incident.varResult === 0 ? incident.playerName : CommonFunctions.mappingVarResultText(incident.varResult)}
                                        <span className="noted"></span>
                                    </span>
                                </li>
                                {
                                    (incident.type === IncidentStatus.Goal && incident.assistName) &&
                                    <li className="sp-score">
                                        <i className="icon-livescore icon-shoes" /> <span className="item-th-name">{incident.assistName} <span className="noted"></span></span>
                                    </li>
                                }
                            </ul>
                        }
                    </div>
                    <ul className="item-mins flexbox">
                        <li>
                            {
                                this.checkIncidentTypeToShowScore(incident.type) &&
                                <span className="name-th">{processScore} <span className="noted"></span></span>
                            }
                        </li>
                        <li className="icon-th">
                            <IncidentIcon type={incident.type} />
                        </li>
                    </ul>
                    <div className="inner-item-db flexbox item-th-away" style={this.getBorder(incident, IncidentPosition.Away)}>
                        {
                            incident.position === IncidentPosition.Away &&
                            <ul className="item-th flexbox">
                                <li className="item-th-time">{this.getIncidentTimeShow(incident.timeShow)}</li>
                                <li>
                                    <span className="item-th-name">
                                        {incident.varResult === 0 ? incident.playerName : CommonFunctions.mappingVarResultText(incident.varResult)}
                                        <span className="noted"></span>
                                    </span>
                                </li>
                                {
                                    (incident.type === IncidentStatus.Goal && incident.assistName) &&
                                    <li className="sp-score">
                                        <span className="item-th-name">{incident.assistName} <span className="noted"></span></span> <i className="icon-livescore icon-shoes" />
                                    </li>
                                }
                            </ul>
                        }
                    </div>
                </div>
            </div>
        );
    };

    getIncidentTimeShow = time => time !== '' ? `${time}'`: '';

    render() {
        if (!this.props.incident) {
            return null;
        }
        const { incident } = this.props;
        let html = null;
        if(incident.type === IncidentStatus.Substitution) {
            html = this.renderSubsitution();
        } else {
            html = this.renderGeneral();
        }
        return (
            <>
                {html}
            </>
        );
    }
}
