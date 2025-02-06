import React from 'react';
import DatePicker from './date-picker/index';
import WeekBar from './WeekBar';
import withNavigation from '@jsroot/components/withNavigation';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';

export const DateBar = ({ isMobile, totalMatches, onClick, navigate, getDateRanges }) => {
    const onClickLiveButton = () => {
        window.isLivePage = true;
        onClick();
        navigate(Site.resolveClientUrl(`lich-thi-dau/bong-da/truc-tiep`));
        document.title = 'TRỰC TIẾP BÓNG ĐÁ HÔM NAY - Link xem bóng đá online';
    };

    return (
        <div className="livescore-soccer-date-bar">
            <div className={`btn-live ${window.isLivePage ? 'active' : ''}`}
                onClick={onClickLiveButton}
            >
                <i className="icon-livescore icon-live-realtime"></i>
                <div className="btn-live-realtime">
                    {isMobile ? 'Live' : LangHelper.getResource('Live')}
                    {
                        totalMatches > 0 &&
                        <span className="badge-live">{totalMatches > 99 ? '99+' : totalMatches}</span>
                    }
                </div>
            </div>
            <WeekBar isMobile={isMobile}
                getDateRanges={getDateRanges}
                onClick={onClick}
            />
            <DatePicker
                getDateRanges={getDateRanges}
                onChange={onClick}
                navigate={navigate}
            />
        </div>
    );
};

export default withNavigation(DateBar);