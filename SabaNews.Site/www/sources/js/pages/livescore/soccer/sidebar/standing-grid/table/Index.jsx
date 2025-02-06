import React from 'react';
import TableHead from './Head';
import TableBody from './Body';

const Index = ({ standings, isCup }) => {
    const totalItems = standings.length;
    return (
        <>
            {
                standings.map((group, index) => {
                    const groupName = totalItems > 1 || isCup ? `Bảng ${group.key.charAt(0)}` : 'Đội';

                    return (
                        <div key={index} className="table-custom">
                            <TableHead groupName={groupName} />
                            <TableBody teams={group.childs} />
                        </div>
                    );
                })
            }
        </>
    );
};

export default Index;