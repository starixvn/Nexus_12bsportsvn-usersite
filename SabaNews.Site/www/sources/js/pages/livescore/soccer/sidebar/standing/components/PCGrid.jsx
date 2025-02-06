import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';

export default class MobileGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.state = {
            isShowList: false
        };

    }

    handleClickOutside = event => {
        if (this.state.isShowList && this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({
                isShowList: false
            });
        }
    };

    toggleListLeague = () => {
        this.setState({ isShowList: !this.state.isShowList })
    };

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleSelectLeague = leagueId => {
        this.props.handleSelectLeague(leagueId);
    };


    render() {
        const { standings, currentLeagueStanding } = this.props;
        const { isShowList } = this.state;
        return (
            <>
                <span ref={this.wrapperRef} className="pc-match" >
                    <span className="league-name" onClick={event => this.props.handleClickStanding(event, currentLeagueStanding.league)}>
                        {CommonFunctions.getLeagueName(currentLeagueStanding.league)}
                    </span>
                    <i onClick={this.toggleListLeague} className="icon-chevron-down" />
                </span>
                {
                    isShowList &&
                    <div className={`scroll-dropdown-standing`}>
                        <ul className="dropdown-select">
                            {
                                standings.map((standing, index) =>
                                    standing.standing.length > 0 &&
                                    <li onClick={() => this.handleSelectLeague(standing.league.leagueId)} key={index}>{CommonFunctions.getLeagueName(standing.league)}</li>)
                            }
                        </ul>
                    </div>

                }
            </>
        );
    }
}