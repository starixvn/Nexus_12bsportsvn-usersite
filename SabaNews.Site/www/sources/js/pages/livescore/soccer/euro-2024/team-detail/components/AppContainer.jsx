import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MatchGrid from './MatchGrid';
import Players from './Players';
import CommonFunctions from '@jsroot/common/common-functions';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import TeamHistory from './TeamHistory';
import SignalR from './SignalR';


const tabs = [
    {
        id: 1,
        slug: 'lich-thi-dau',
        name: 'Lịch thi đấu'
    },
    {
        id: 2,
        slug: 'ket-qua',
        name: 'Kết quả'
    },
    {
        id: 3,
        slug: 'cau-thu',
        name: 'Cầu Thủ'
    },
    {
        id: 4,
        slug: 'tieu-su',
        name: 'Tiểu sử'
    }
];
export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 1,
            titleNav : tabs[0].name
        },
        this.handleSelectTab = this
                .handleSelectTab
                .bind(this);
    }
    componentDidMount() {
        this.props.getTeamData(window.teamId);
    }

    handleSelectTab = key => {
        this.setState({
            active: key
        })
    }
    groupPlayers  = players => {
        const positions  = ['Huấn luyện viên' , 'Thủ môn' , 'Hậu vệ', 'Tiền vệ','Tiền đạo']
        const tempPlayer = [];
        if(players){
            positions.map((p, index) => {
                var positionId = index + 1;
                const listPlayer = players.filter(player => player.position == positionId);
                if(listPlayer.length > 0) {
                    const item = {
                        position : p,
                        positionId,
                        players : [...listPlayer]
                    }
                    tempPlayer.push(item);
                }
            });
        }
        return  tempPlayer;
    }
    renderContent = () => {
        const { preMatches, postMatches, players , profile } = this.props;
        const player = this.groupPlayers(players);
        switch (this.state.active) {
            case 1:
                return  preMatches.length ? <MatchGrid matches={preMatches} /> : <div>Đang cập nhật dữ liệu</div>
            case 2:
                return postMatches.length ? <MatchGrid matches={postMatches} /> : <div>Đang cập nhật dữ liệu</div>
            case 3:
                return player.length ? <Players data={player} /> : <div>Đang cập nhật dữ liệu</div>
            case 4:
                return profile ? <TeamHistory data={profile}/> : <div>Đang cập nhật dữ liệu</div>
            default:
                return <MatchGrid matches={preMatches} />
        }
    }
    render() {
        const { team  } = this.props;
        if(team === null) {
            return null;
        }
        return (
            <div className="block-info-team">
                <SignalR  />
                <div className="container">
                    <div className="info-main-team">
                        <div className="team-header">
                            <div className="name-team-detail">
                                <div className="team-detail-logo"><TeamIcon src={CommonFunctions.getTeamIcon(team)} /></div>
                                <div className="team-detail-name">{CommonFunctions.getTeamName(team)}</div>
                            </div>
                            <div className="team-menu-tabs">
                                <ul className="nav-team">
                                    {
                                        tabs.map(item => (
                                            <li key={item.id} onClick={() => this.handleSelectTab(item.id)} className={`nav-team-item ${this.state.active === item.id ? 'active' : ''}`}>
                                                {item.name}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="team-body">
                            {this.renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { preMatches, postMatches, players, team, profile } = state;
    return { preMatches, postMatches, players, team, profile };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);