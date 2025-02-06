import React, { PureComponent } from 'react';
import Table from './table/Index';
import MultipleGroupStanding from './MultipleGroupStanding';

export default class StandingGrid extends PureComponent {
    constructor(props) {
        super(props);

    }

    groupStandingsByGroupName = standings => {
        const totalItems = standings.length;
        const tmpStandings = [];
        for (let i = 0; i < totalItems; i++) {
            const temp = standings[i];
            const key = temp.groupName;
            const item = {
                key,
                childs: [temp]
            };
            if (tmpStandings.length === 0) {
                tmpStandings.push(item);
            } else {
                const index = tmpStandings.findIndex(x => x.key === key);
                if (index === - 1) {
                    tmpStandings.push(item);
                } else {
                    tmpStandings[index].childs.push(temp);
                }
            }
        }

        return tmpStandings;
    };

    groupStandingsByStage = standings => {
        let totalItems = standings.length;
        const tmpStandings = [];
        for (let i = 0; i < totalItems; i++) {
            const temp = { ...standings[i] };
            temp.promotion = JSON.parse(temp.promotion);
            temp.promotion = temp.promotion && temp.promotion.Color ? temp.promotion : null;
            const item = {
                stageId: temp.stageId,
                stageNameEN: temp.stageNameEN,
                stageNameVN: temp.stageNameVN,
                orderIndex: temp.orderIndex,
                childs: [temp]
            };
            if (tmpStandings.length === 0) {
                tmpStandings.push(item);
            } else {
                const index = tmpStandings.findIndex(x => x.stageId === temp.stageId);
                if (index === - 1) {
                    tmpStandings.push(item);
                } else {
                    tmpStandings[index].childs.push(temp);
                }
            }
        }

        totalItems = tmpStandings.length;
        for (let i = 0; i < totalItems; i++) {
            tmpStandings[i].childs = this.groupStandingsByGroupName(tmpStandings[i].childs);
        }

        return tmpStandings;
    };


    render() {
        const standing = this.groupStandingsByStage(this.props.leagueStanding.standing)
        const lastStanding = standing[standing.length - 1];
        return (
            <>
                {lastStanding.childs.length === 1 &&
                    <Table standings={lastStanding.childs} />
                }
                {
                    lastStanding.childs.length > 1 && <MultipleGroupStanding standings={lastStanding.childs} />
                }
            </>
        );
    }
}