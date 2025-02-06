import React, { Component } from 'react';
import { JsonHubProtocol, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Site from '@jsroot/common/site';
import { ActionCreators } from '../actions';

export class SignalR extends Component {
    constructor(props) {
        super(props);

        this.connection = null;
    }

    componentDidMount() {
        const options = {
            transport: HttpTransportType.WebSockets,
            logMessageContent: false,
            skipNegotiation: true,
            logger: LogLevel.None
        };
        const protocol = new JsonHubProtocol();

        this.connection = new HubConnectionBuilder()
            .withUrl('/livescore/hubs', options)
            .withHubProtocol(protocol)
            .build();

        this.connection.on('UpdateMatchDetail', data => {
            this.props.setMatch(data);
        });

        this.connection.onclose(async () => {
            await this.start();
        });

        Site.lockNavigator();

        this.start();
    }

    componentWillUnmount() {
        this.connection.invoke('LeaveSoccerGroup', window.selectedMatchId)
            .then(() => {
                console.log(`leave group ${window.selectedMatchId}`); //NOSONAR
            }).catch(err => {
                console.error(err.toString()); //NOSONAR
            });
        this.connection.stop();
    }

    start = async () => {
        try {
            await this.connection.start().then(() => {
                this.connection.invoke('JoinSoccerGroup', window.selectedMatchId)
                    .then(() => {
                        console.log(`join group ${window.selectedMatchId}`); //NOSONAR
                    }).catch(err => {
                        console.error(err.toString()); //NOSONAR
                    });
            }).catch(err => {
                console.error(err.toString()); //NOSONAR
            });
        } catch (err) {
            console.log(err); //NOSONAR

            setTimeout(() => {
                this.getMatchDetail();
                this.start();
            }, 60 * 1000);
        }
    };

    render() {
        return <span />;
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

export default connect(null, mapDispatchToProps)(SignalR);