import React, { PureComponent } from 'react';
import Item from './Item';


export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
    }


    render() {
        const { matches, startNum } = this.props;
        let num = startNum;
        return (
            <div className="statistic-grid">
                {
                    matches.map((item, index) => {
                        num++;
                        return <Item key={index} number={num} match={item} />;
                    })
                }
            </div>
        );
    }
}
