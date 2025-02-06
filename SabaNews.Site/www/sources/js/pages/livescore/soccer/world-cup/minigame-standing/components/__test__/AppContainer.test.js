import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';


describe('AppContainer', () => {
    const defaultProps = {
        matches:null, 
        stages:null, 
        league:null, 
        votes:null,
        getMatches: jest.fn(),
        getVotes: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('renders', () => {
        it('return null when data is null', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when data is not null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should call getMainSettings', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]
            }
            window.CountStageActive = 1;
            //Act
            shallow(<AppContainer {...props} />);

            // Assert
            expect(props.getMatches).toHaveBeenCalled();
            expect(props.getVotes).toHaveBeenCalled();
        });
        
        it('should call handleChange', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]
            }
            const event = {
                target: {
                    name: 'Giai Đoạn 2',
                    value: 2
                }
            };
            window.CountStageActive = 2;
            //Act
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            
            instance.handleChange(event);
            // Assert
            expect(container.instance().state.selectedStage).toEqual(2);
        });    
    });
});