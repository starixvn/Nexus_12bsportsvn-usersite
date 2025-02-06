import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MatchGrid from '../../match-grid/Index';
import SkeletonGrid from '../../match-grid/SkeletonGrid';
import SignalR from './SignalR';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getMatches();
    }


    handleClickFixture = event => {
        const url = 'lich-thi-dau/bong-da';
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };


    render() {
        const { matches, league } = this.props;
        return (
            <>
                <SignalR />
                <div className="livescore-home">
                    <div className="block__title" onClick={this.handleClickFixture}><h2><a>Lịch thi đấu</a></h2></div>
                    {
                        matches === null && <SkeletonGrid />
                    }
                    <div className="livescore-soccer-main">
                        {
                            matches !== null && league !== null &&
                            <MatchGrid league={league} matches={matches} isShowEmptyFixture={true} />
                        }
                    </div>
                    <div className="view-more-block" onClick={this.handleClickFixture}>
                        <a>Xem Thêm</a>
                    </div>
                </div>
            </>
        );
    }

}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { matches, league } = state;
    return { matches, league };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);