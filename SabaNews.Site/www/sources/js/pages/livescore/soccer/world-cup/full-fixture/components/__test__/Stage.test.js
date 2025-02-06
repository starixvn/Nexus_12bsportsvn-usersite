import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Stage from '../Stage';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('Stage', () => {
    const defaultProps = {
        stages: [{ key: 1, stage: { stageNameVN: "vn" }, childs: [{ matchId: 1 }, { matchId: 2 }] }],
        selectedStageId: 1,
        onSetStageId: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        // Arrange & Act
        const container = shallow(<Stage {...defaultProps} />);

        //Act
        container.find('.live-score-nav').simulate('select', 'key');

        // Assert
        expect(defaultProps.onSetStageId).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });
});