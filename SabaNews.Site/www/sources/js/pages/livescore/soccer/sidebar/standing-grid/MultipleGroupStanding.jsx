import React, { PureComponent } from 'react';
import TableHead from './table/Head';
import TableBody from './table/Body';

const showItem = 6;
export default class MultipleGroupStanding extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: props.standings[0].key,
            startItem: 0,
            endItem: showItem
        }
    }
    componentDidUpdate(prevProps) {
        if(this.props.standings !== prevProps.standings) {
            this.setState({
                selectedKey: this.props.standings[0].key,
                startItem: 0,
                endItem: showItem
            });
        }
    }

    handleSelectedGroup = key => {
        this.setState({selectedKey: key});
    };

    handleNextTab = () => {
        const { standings } = this.props;
        const { startItem, endItem } = this.state;
        if(endItem < standings.length && standings.length > showItem) {
            this.setState({startItem: startItem + 1, endItem: endItem  + 1});
        }
    };

    handlePrevTab = () => {
        const { startItem, endItem } = this.state;
        if(startItem > 0) {
            this.setState({startItem: startItem - 1, endItem: endItem  - 1});
        }
    };


    render() {
        const { startItem, endItem, selectedKey } = this.state;
        const { standings  } = this.props;
        const standingsShow = standings.slice(startItem, endItem);
        const selectedGroup = standings.find(item => item.key === selectedKey);
        const totalItem = standings.length;
        if(!selectedGroup) {
            return null;
        }
        return (
            <>
                <ul className="homepage-group-standing live-score-nav">
                    <li className={`btn-btn-standing prev-standing ${startItem === 0 ? 'disabled': '' }`} onClick={this.handlePrevTab}><i className="icon-chevron-left" /></li>
                    {
                        standingsShow.map((group, index) => {
                            const groupName = group.key.charAt(0);
                            return (
                                <li onClick={() => this.handleSelectedGroup(group.key)} className={`${selectedKey === group.key ? 'active' : ''}`} key={index}>{groupName}</li>
                            )
                        })
                    }
                    <li  className={`btn-btn-standing next-standing ${(endItem >= totalItem || totalItem <= endItem) ? 'disabled': '' }`} onClick={this.handleNextTab}><i className="icon-chevron-right" /></li>
                </ul>
                <div className="table-custom">
                    <TableHead groupName={`Bảng ${selectedGroup.key.charAt(0)}`} isMobile={true} />
                    <TableBody teams={selectedGroup.childs} isMobile={true} />
                </div>
            </>
        );
    }
}
