import React, { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import GridItem from './GridItem';

export default class Grid extends PureComponent {
    constructor(props) {
        super(props);

        this.batchSize = 50;
        const matches = props.matches;
        const groupIndex = this.getGroupIndex(matches, 0) + 1;
        const items = matches.slice(0, groupIndex);
        this.state = ({
            groupIndex,
            pageIndex: 0,
            hasMore: groupIndex < matches.length,
            matches: items
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.matches !== prevProps.matches) {
            const matches = this.props.matches;
            const groupIndex = this.getGroupIndex(matches, 0) + 1;
            const items = matches.slice(0, groupIndex);
            this.setState({
                groupIndex,
                pageIndex: 0,
                hasMore: groupIndex < matches.length,
                matches: items
            });
        }
    }

    getGroupIndex = (matches, currentIndex) => {
        const totalItems = matches.length;
        let count = 0;
        let index = currentIndex;
        for (index; index < totalItems; index++) {
            for (const child of matches[index].childs) {
                count += child.key ? child.childs.length : 1;
            }

            if (count >= this.batchSize) {
                break;
            }
        }

        return index;
    };

    loadMore = pageIndex => {
        const matches = this.props.matches;
        const groupIndex = this.getGroupIndex(matches, this.state.groupIndex) + 1;
        const items = matches.slice(0, groupIndex);
        this.setState({
            groupIndex,
            pageIndex,
            hasMore: groupIndex < matches.length,
            matches: items
        });
    };

    render() {
        const { hasMore, matches } = this.state;
        const { searchKey, league } = this.props;

        return (
            <InfiniteScroll initialLoad={false}
                pageStart={1}
                loadMore={this.loadMore}
                hasMore={hasMore}
                useWindow={true}
            >
                {
                    matches.map(item => <GridItem key={item.key} searchKey={searchKey} league={league} item={item} />)
                }
            </InfiniteScroll>
        );
    }
}