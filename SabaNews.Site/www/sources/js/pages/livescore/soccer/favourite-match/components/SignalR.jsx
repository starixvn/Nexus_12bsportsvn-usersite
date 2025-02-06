import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { JsonHubProtocol, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { ActionCreators } from '../actions';
import Site from '@jsroot/common/site';

export class SignalR extends Component {
    constructor(props) {
        super(props);

        this.connection = null;
    }

    componentDidMount() {
        Site.lockNavigator();

        const options = {
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
            logger: LogLevel.None,
            logMessageContent: false
        };
        this.connection = new HubConnectionBuilder()
            .withUrl('/livescore/hubs', options)
            .withHubProtocol(new JsonHubProtocol())
            .build();

        this.connection.on('UpdateLiveMatches', matches => {
            this.props.setLiveMatches(matches);
        });

        this.connection.onclose(async () => {
            await this.start();
        });

        this.start();
    }

    componentWillUnmount() {
        this.connection.stop();
    }

    start = async () => {
        try {
            await this.connection.start();
        } catch (err) {
            console.log(err); //NOSONAR

            setTimeout(() => {
                this.props.getMatches();
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