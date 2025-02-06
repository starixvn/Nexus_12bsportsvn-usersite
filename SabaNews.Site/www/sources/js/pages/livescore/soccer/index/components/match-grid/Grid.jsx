import React, { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import League from './League';
import Banner from '@jsroot/components/Banner';
import { BannerType } from '@jsroot/common/constants';
export default class Grid extends PureComponent {
    constructor(props) {
        super(props);

        this.batchSize = 50;
        const leagues = props.leagues;
        const groupIndex = this.getGroupIndex(leagues, 0) + 1;
        const items = leagues.slice(0, groupIndex);
        this.state = ({
            groupIndex,
            pageIndex: 0,
            hasMore: groupIndex < leagues.length,
            leagues: items
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.leagues !== prevProps.leagues) {
            const leagues = this.props.leagues;
            const groupIndex = this.getGroupIndex(leagues, 0) + 1;
            const items = leagues.slice(0, groupIndex);
            this.setState({
                groupIndex,
                pageIndex: 0,
                hasMore: groupIndex < leagues.length,
                leagues: items
            });
        }
    }

    getGroupIndex = (leagues, currentIndex) => {
        const totalItems = leagues.length;
        let count = 0;
        let index = currentIndex;
        for (index; index < totalItems; index++) {
            count += leagues[index].matches.length;

            if (count >= this.batchSize) {
                break;
            }
        }

        return index;
    };

    loadMore = pageIndex => {
        const leagues = this.props.leagues;
        const groupIndex = this.getGroupIndex(leagues, this.state.groupIndex) + 1;
        const items = leagues.slice(0, groupIndex);
        this.setState({
            groupIndex,
            pageIndex,
            hasMore: groupIndex < leagues.length,
            leagues: items
        });
    };

    render() {
        const { hasMore, leagues } = this.state;
        const { banner } = this.props;
        return (
            <div className="soccer-match-grid">
                <InfiniteScroll initialLoad={false}
                    pageStart={1}
                    loadMore={this.loadMore}
                    hasMore={hasMore}
                    useWindow={true}
    
                >
                    {
                        leagues.map((league, index) => {
                            return (
                                <div key={index}>
                                    <League league={league} />
                                    {index === 1 &&
                                        <>
                                            <Banner banner={banner} type={BannerType.DesktopLeft}/>
                                            <Banner banner={banner} type={BannerType.MobileTop} isMobile />
                                        </>
                                    }
                                    {index === 3 && <Banner banner={banner} type={BannerType.MobileCenter} isMobile />}
                                </div>
                            );
                        })
                    }
                </InfiniteScroll>
            </div>
        );
    }
}