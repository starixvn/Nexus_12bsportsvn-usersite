import React from 'react';
import { shallow } from 'enzyme';
import MobileStage from '../MobileStage';


describe('MobileStage', () => {
    const defaultProps = {
        stages: [{key: 1, stage:{stageNameVN: "vn"}, childs: [{matchId: 1}, {matchId: 2}]}],
        selectedStageId: 1,
        onSetStageId: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatchWithStage', () => {
        it('return correctly data when call function', () => {
             // Arrange
            const container = shallow(<MobileStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchWithStage();

            // Assert
            expect(result).toEqual(defaultProps.stages[0]);
        });
    });

    describe('onChange', () => {
        it('call exacly function when call function', () => {
             // Arrange
            const container = shallow(<MobileStage {...defaultProps} />);
            const event = {target: {value: 'value'}};
             // Act
            container.find('select').simulate('change', event);

             // Assert
             expect(defaultProps.onSetStageId).toHaveBeenCalled();
        });
    });

    describe('renders', () => {
        it('render correctly', () => {
             // Arrange & Act
             const container = shallow(<MobileStage {...defaultProps} />);
 
              // Assert
              expect(container).toMatchSnapshot();
        });
    })
});