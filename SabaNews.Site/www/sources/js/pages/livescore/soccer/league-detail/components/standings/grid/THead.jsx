import React from 'react';

const THead = ({ groupName, isMobile }) => {
    return (
        <div className="table-custom-header">
            <div className="table-custom-cell cell-rank">#</div>
            <div className="table-custom-cell cell-participant">{groupName}</div>
            <div className="table-custom-cell cell-rank">Trận</div>
            {!isMobile && <div className="table-custom-cell cell-rank">Thắng</div>}
            {!isMobile && <div className="table-custom-cell cell-rank">Hòa</div>}
            {!isMobile && <div className="table-custom-cell cell-rank">Bại</div>}
            {!isMobile && <div className="table-custom-cell cell-rank">Bàn thắng</div>}
            {!isMobile && <div className="table-custom-cell cell-rank">Bàn bại</div>}
            <div className="table-custom-cell cell-rank">+/-</div>
            <div className="table-custom-cell cell-rank">Điểm</div>
            {!isMobile && <div className="table-custom-cell cell-rank cell-form">Phong độ</div>}
        </div>
    );
};

export default THead;