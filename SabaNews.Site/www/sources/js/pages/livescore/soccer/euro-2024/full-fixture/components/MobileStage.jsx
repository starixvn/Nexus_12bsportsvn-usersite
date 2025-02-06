import React, { PureComponent } from 'react';
import GridItem from './GridItem';
import CommonFunctions from '@jsroot/common/common-functions';

export default class MobileStage extends PureComponent {

    getMatchWithStage = () => {
        const { stages, selectedStageId } = this.props;
        const stage = stages.find(item => item.key === parseInt(selectedStageId, 10));
        return stage;
    };

    onChange = event => {
        this.props.onSetStageId(event.target.value);
    };
    render() {
        const { stages, selectedStageId } = this.props;
        const currentStage = this.getMatchWithStage();
        return (
            <>
                <div className="nav-select-mb">
                    <div className="name-round">{CommonFunctions.getStageName(currentStage.stage)}</div>
                    <select onChange={this.onChange} value={selectedStageId}>
                        {
                            stages.map(group =>
                                <option value={group.key} key={group.key} >{CommonFunctions.getStageName(group.stage)}</option>)
                        }
                    </select>
                </div>
                <>
                    {
                        <GridItem items={currentStage.childs} />
                    }
                </>
            </>
        );
    }
}