import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import SignalR from './SignalR';
import Fixture from './Fixture';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getLiveMatches();
        this.props.getTodayMatches();
    }
    render() {
        const { liveMatches, todayMatches } = this.props;
        const liveUrl = '/lich-thi-dau/bong-da/truc-tiep';
        const todayUrl = '/lich-thi-dau/bong-da';
        return (
            <>
                <SignalR/>
                <Fixture data={liveMatches} title="LTĐ Trực Tiếp" url={liveUrl} isLiveTitle={true}/>
                <Fixture data={todayMatches} title="LTĐ Hôm Nay" url={todayUrl} isLiveTitle={false}/>
            </>
        );
    }
}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { liveMatches, todayMatches } = state;
    return { liveMatches , todayMatches };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);