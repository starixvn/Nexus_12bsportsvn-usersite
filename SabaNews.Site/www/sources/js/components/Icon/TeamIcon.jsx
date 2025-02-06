import React from 'react';
import Site from '@jsroot/common/site';

const TeamIcon = ({ className, src,  alt , onClick }) => {
    const handleClick = event => {
        if(onClick) {
            onClick(event);
        }
    };
    return (
        <img className={className} alt={alt} loading="lazy" onClick={handleClick}
            src={src ? src : Site.resolveClientUrl('css/images/logo-dummy.png')}
            height="44"
            width="44"
        />
    );
};

export default TeamIcon;