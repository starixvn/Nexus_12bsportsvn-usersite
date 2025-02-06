import React from 'react';
import TeamIcon from '@jsroot/components/Icon/TeamIcon';
import CommonFunctions from '@jsroot/common/common-functions';
import FavoriteMatches from '@jsroot/components/FavoriteMatches';
import FavouriteLeagueIcon from '@jsroot/components/Icon/FavouriteLeagueIcon';

const League = ({ league, onUpdateFavLeague, flagToggleFavLeagueIcon }) => {
    return (
        <>
            <div className="livescore-league-header-detail">
                <div className="livescore-league-header-detail-group">
                    <div className="livescore-league-header-detail-logo"><TeamIcon src={CommonFunctions.getLeagueIcon(league)} /></div>
                    <div className="livescore-league-header-detail-name">
                        {CommonFunctions.getLeagueName(league)}
                    </div>
                    <FavouriteLeagueIcon league={league} onUpdateFavLeague={onUpdateFavLeague} flagToggle={flagToggleFavLeagueIcon}/>
                </div>
                <div className="group-searchbar">
                    <FavoriteMatches isMobile />
                </div>
            </div>
            <div className="document-text">
                *Thông tin của Lịch Thi Đấu là do bên thứ ba cung cấp và chỉ mang tính chất tham khảo.
            </div>
        </>
    );
};

export default League;