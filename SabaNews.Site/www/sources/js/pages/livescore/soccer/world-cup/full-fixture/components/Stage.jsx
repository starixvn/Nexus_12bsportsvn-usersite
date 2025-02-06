import React, { PureComponent } from 'react';
import CommonFunctions from '@jsroot/common/common-functions';
import { Tabs, Tab } from 'react-bootstrap';
import GridItem from './GridItem';


export default class Stage extends PureComponent {
    constructor(props) {
        super(props);
    }


    handleSelectTab = key => {
        this.props.onSetStageId(key);
    };


    render() {
        const { stages, selectedStageId } = this.props;
        return (
            <Tabs className="live-score-nav" activeKey={selectedStageId} onSelect={this.handleSelectTab}>
                {
                    stages.map(group => {
                        return (
                            <Tab eventKey={group.key} title={CommonFunctions.getStageName(group.stage)}  key={group.key}  className="season-standings">
                                <GridItem items={group.childs}/>
                            </Tab>
                        );
                    })
                }
            </Tabs>
        );
    }
}
