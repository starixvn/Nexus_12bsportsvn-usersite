import React from 'react';
import DateTimeService from '@jsroot/common/dateTimeService';
const Players = ({ data }) => {
    if(!data) return null
    return (
        <>
            {
                data.map((item,index) => (
                    <div className="player-group" key={index}>
                        <div className="player-title">
                            {item.position}
                        </div>
                        <div className="player-main">
                            {
                                item.players.map(player => (
                                    <div key={player.playerId} className="player-items">
                                        <div className="player-header">
                                            <div className="number">{player.shirtNumber}</div>
                                            <div className="name">{player.playerName}</div>
                                            <div className="avatar">
                                                {
                                                    player.icon ?  <img src={player.icon} alt={player.playerName} /> : <img src="/css/images/dum_ava.png" alt="" />
                                                }
                                            </div>
                                        </div>
                                        <div className="player-body">
                                            <div className="position">
                                                <span>Vị trí</span>
                                                <span>{item.position}</span>
                                            </div>
                                            <div className="birthday">
                                                <span>Ngày sinh</span>
                                                <span>{DateTimeService.convertFromUTC(player.birthday).format('DD/MM/YYYY')}</span>
                                            </div>
                                            <div className="club">
                                                <span>Câu lạc bộ</span>
                                                <span>{player.clubName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default Players;