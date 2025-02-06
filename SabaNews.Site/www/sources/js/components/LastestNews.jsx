import React from 'react';
import Site from '@jsroot/common/site';

export const LastestNews = ({posts}) => {
    return (
        <div className="livescore-recent-post">
            <h2 className="livescore-recent-post__title"><a href="#">Tin mới nhất</a></h2>
            <div className="livescore-recent-post__content">
                {
                    posts.map((post, index) => {
                        const link = Site.resolveClientUrl(post.uri);
                        return (
                            <div className="livescore-recent-post__item" key={index}>
                                <div className="img-item">
                                    <a href={link}><img src={post.featureImage} alt="recent-post" className='img-res'/></a>
                                </div>
                                <div className="description-item">
                                    <a href={link}>{post.postTitle}</a>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default LastestNews;