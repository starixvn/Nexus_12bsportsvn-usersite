import React, { Component } from 'react';
import { ActionCreators } from '../actions';
import Site from '@jsroot/common/site';
import { bindActionCreators } from 'redux';
import { JsonHubProtocol, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { connect } from 'react-redux';

export class SignalR extends Component {
    constructor(props) {
        super(props);

        this.connection = null;
    }

    componentWillUnmount() {
        this.connection.stop();
    }

    componentDidMount() {
        const options = {
            logger: LogLevel.None,
            transport: HttpTransportType.WebSockets,
            logMessageContent: false,
            skipNegotiation: true
        };

        this.connection = new HubConnectionBuilder()
            .withUrl('/livescore/hubs', options)
            .withHubProtocol(new JsonHubProtocol())
            .build();

        this.connection.onclose(async () => {
            await this.startFixtureWC();
        });

        this.connection.on('UpdateLiveMatches', matches => {
            this.props.setLiveMatches(matches);
        });

        Site.lockNavigator();

        this.startFixtureWC();
    }

    startFixtureWC = async () => {
        try {
            await this.connection.start();
        } catch (err) {
            setTimeout(() => {
                this.props.getMatches();
                this.startFixtureWC();
            }, 60 * 1000);

            console.log(err); //NOSONAR
        }
    };

    render() {
        return <div />;
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

export default connect(null, mapDispatchToProps)(SignalR);