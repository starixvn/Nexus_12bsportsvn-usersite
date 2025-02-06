import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MatchGrid from '../../match-grid/Index';
import SkeletonGrid from '../../match-grid/SkeletonGrid';
import SignalR from './SignalR';
import { Width1024 } from '@jsroot/common/constants';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: window.innerWidth <= Width1024 ? true : false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.props.getLeagues();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const isMobile = this.state.isMobile;
        if (!isMobile && window.innerWidth <= Width1024) {
            this.setState({ isMobile: true });
        } else {
            if (isMobile && window.innerWidth > Width1024) {
                this.setState({ isMobile: false });
            }
        }
    };


    handleClickFixture = event => {
        const url = '/lich-thi-dau/bong-da';
        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            window.location = url;
        }
    };


    render() {
        const { leagues } = this.props;
        return (
            <>
                <SignalR />
                <div className="livescore-home">
                    <div className="block__title" onClick={this.handleClickFixture}><h2><a>Lịch thi đấu</a></h2></div>
                    {
                        leagues === null && <SkeletonGrid />
                    }
                    <div className="livescore-soccer-main">
                        {
                            leagues !== null &&
                            leagues.map((item, key) => {
                                return <MatchGrid key={key} league={item.league} matches={item.matches} />
                            })
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
    const { leagues, league } = state;
    return { leagues, league };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);