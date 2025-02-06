import React from 'react';

const Head = ({ groupName }) => {
    return (
        <div className="table-custom-header">
            <div className="table-custom-cell cell-rank">#</div>
            <div className="table-custom-cell cell-participant">{groupName}</div>
            <div className="table-custom-cell cell-rank">Trận</div>
            <div className="table-custom-cell cell-rank">+/-</div>
            <div className="table-custom-cell cell-rank">Điểm</div>
        </div>
    );
};

export default Head;