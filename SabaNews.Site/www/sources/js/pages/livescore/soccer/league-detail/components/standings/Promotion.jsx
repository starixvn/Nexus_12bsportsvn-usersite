import React from 'react';

const Promotion = ({ promotions }) => {
    return (
        <div className="promotion">
            {
                promotions.map(item =>
                    <div key={item.Id} className="promotion-flex">
                        <div className="promotion-color" style={{ backgroundColor: item.Color }} />
                        <div className="promotion-name">{item.NameEN}</div>
                    </div>
                )
            }
        </div>
    );
};

export default Promotion;