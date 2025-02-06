import React from 'react';
import dayjs from 'dayjs';

const WeekDay = ({ isMobile, today, selectedDate, currentDate, onClick }) => {
    const date = dayjs(currentDate);
    const isActive = dayjs(selectedDate).isSame(date) && !window.isLivePage;
    const isToday = date.isSame(today);

    return (
        <div className={`week-date ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => onClick(currentDate)}
        >
            <div className="day-of-week">
                {isMobile ? date.format('ddd') : date.format('dddd')}
            </div>
            <div className="date">{date.format('DD/MM')}</div>
        </div>
    );
};

export default WeekDay;