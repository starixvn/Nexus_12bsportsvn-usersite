import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

export class TodayPost extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getTodayFixturePosts();
    }
    render() {
        const { todayFixturePosts } = this.props;
        if (todayFixturePosts === null) {
            return null;
        }
        return (
            <div className="livescore-news">
                <div className="block__title">
                    <h2><a href="/tag/lich-thi-dau-hom-nay">Trực tiếp bóng đá hôm nay</a></h2>
                </div>
                {
                    todayFixturePosts.map((post, index) => {
                        return (
                            <div className="post card-horizontal" key={index}>
                                <a href={`/${post.uri}`} className="card-horizontal__image hover-image">
                                    <img src={post.featureImage} alt="" className="img-res img-block" />
                                </a>
                                <div className="card-horizontal__content">
                                    <h3>
                                        <a href={`/${post.uri}`} className="title">
                                            {post.postTitle}
                                        </a>
                                    </h3>
                                    <p className="description">{post.postExcerpt}</p>
                                    <p className="datetime">
                                        <span>{post.postTime}</span>
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { todayFixturePosts } = state;
    return { todayFixturePosts };
};

export default connect(mapStateToProps, mapDispatchToProps)(TodayPost);
