import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { LogLevel, JsonHubProtocol, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { connect } from 'react-redux';
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

        this.connection = new HubConnectionBuilder()
            .withUrl('/livescore/hubs', options)
            .withHubProtocol(new JsonHubProtocol())
            .build();

        this.connection.onclose(async () => {
            await this.startFixtureHomepage();
        });

        this.connection.on('UpdateLiveMatches', matches => {
            this.props.setLiveMatches(matches);
        });

        Site.lockNavigator();

        this.startFixtureHomepage();
    }

    startFixtureHomepage = async () => {
        try {
            await this.connection.start();
        } catch (err) {
            setTimeout(() => {
                this.props.getLeagues();
                this.startFixtureHomepage();
            }, 60 * 1000);

            console.log(err); //NOSONAR
        }
    };

    componentWillUnmount() {
        this.connection.stop();
    }

    render() {
        return <span />;
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

export default connect(null, mapDispatchToProps)(SignalR);