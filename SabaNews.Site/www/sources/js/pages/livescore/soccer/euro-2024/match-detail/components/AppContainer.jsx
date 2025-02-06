import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignalR from './SignalR';
import Detail from './Detail';
import { ActionCreators } from '../actions';
import GeneralInfo from './GeneralInfo';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getMatchDetail();
    }


    render() {
        const { match } = this.props;
        if (!this.props.match || !this.props.match.generalInfo) {
            return null;
        }
        return (
            <>
                <div className="container livescore-container">
                    <SignalR />
                    <div className="livescore-soccer">
                        <div className="livescore-soccer-main">
                            <GeneralInfo match={match} />
                            <Detail />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match, leagues } = state;
    return { match, leagues };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);