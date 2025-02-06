import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { JsonHubProtocol, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { ActionCreators } from '../actions';
import Site from '@jsroot/common/site';

export class SignalR extends Component {
    constructor(props) {
        super(props);

        this.connection = null;
    }

    componentDidMount() {
        const options = {
            transport: HttpTransportType.WebSockets,
            logMessageContent: false,
            logger: LogLevel.None
        };

        this.connection = new HubConnectionBuilder()
            .withUrl('/livescore/hubs', options)
            .withHubProtocol(new JsonHubProtocol())
            .build();

        this.connection.onclose(async () => {
            await this.start();
        });

        this.connection.on('UpdateLiveMatches', matches => {
            this.props.setLiveMatches(matches);
        });

        Site.lockNavigator();

        this.start();
    }

    componentWillUnmount() {
        this.connection.stop();
    }

    start = async () => {
        try {
            await this.connection.start();
        } catch (err) {
            setTimeout(() => {
                const { today, selectedDate } = this.props;
                if (window.isLivePage || today === selectedDate) {
                    this.props.getMatches(selectedDate);
                }

                this.start();
            }, 60 * 1000);

            console.log(err); //NOSONAR
        }
    };

    render() {
        return <span />;
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { today, selectedDate } = state;
    return { today, selectedDate };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignalR);