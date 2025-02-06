import React from 'react';
const TeamHistory = ({ data }) => {
    const onClick = () => {
        window.location = `/euro-2024/${data.postName}${data.uri}`;
    };
    return (
        <div className="team-history">
            <div className="team-history-image" onClick={onClick}>
                <img src={data.featureImage} alt={data.postTitle} />
            </div>
            <div className="group-history">
                <div className="team-history-titlte" onClick={onClick}>{data.postTitle}</div>
                <div className="team-history-description">
                    {data.postExcerpt}
                </div>
                <div className="team-history-date">{data.postTime}</div>
            </div>
        </div>
    );
};

export default TeamHistory;