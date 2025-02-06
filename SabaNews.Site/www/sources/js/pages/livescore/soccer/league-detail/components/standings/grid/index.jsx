import React from 'react';
import THead from './THead';
import TBody from './TBody';

const Index = ({ standings, isMobile, isCup }) => {
    const totalItems = standings.length;
    return (
        <>
            {
                standings.map((group, index) => {
                    const groupName = totalItems > 1 || isCup ? `Bảng ${group.key.charAt(0)}` : 'Đội';

                    return (
                        <div key={index} className="table-custom">
                            <THead groupName={groupName} isMobile={isMobile} />
                            <TBody teams={group.childs} isMobile={isMobile} />
                        </div>
                    );
                })
            }
        </>
    );
};

export default Index;