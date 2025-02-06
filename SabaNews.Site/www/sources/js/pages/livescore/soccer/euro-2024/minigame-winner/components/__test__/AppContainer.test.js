import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';


describe('AppContainer', () => {
    const defaultProps = {
        matches:null, 
        stages:null, 
        league:null, 
        votes:[],
        getMatches: jest.fn(),
        getVotes: jest.fn(),
        handleChange: jest.fn()
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

        it('return correctly when data stage votes is undefined ', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [[{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.state.selectedStage = 2;

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('call function correct when get vote change', () => {
            // Arrange
            const props = {
                ...defaultProps,
                votes: [[{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            instance.handleChange(1);
            instance.handleChange(1);

            // Assert
            expect(defaultProps.getVotes).toHaveBeenCalled();
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
            //Act
            shallow(<AppContainer {...props} />);

            // Assert
            expect(props.getMatches).toHaveBeenCalled();
            expect(props.getVotes).toHaveBeenCalled();
        });  

        it('should call correct function when click button stage on pc', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}],
                handleChange: jest.fn()
            };
            const event = {
                target: {
                    name: 'Giai Đoạn 2',
                    value: 2
                }
            };
            window.CountStageEnd = 3;
            window.innerWidth = 1200;

            //Act
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            instance.handleChangeSelect(event);
            container.find('.buttonStage').first().simulate('click');

            // Assert
            expect(container.instance().state.selectedStage).toEqual(1);
            expect(props.handleChange).toHaveBeenCalledTimes(0);

        });

        it('should call correct function when click button stage on mobile', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{matchId: 1, stage:{ stageId: 1}}, {matchId: 2, stage:{ stageId: 2}}],
                votes: [{matchId: 1, stage:{ stageId: 1} }, {matchId:2, stage:{ stageId: 2}}]
            };
            const event = {
                target: {
                    name: 'Giai Đoạn 2',
                    value: 2
                }
            };
            window.innerWidth = 600;
            window.CountStageEnd = 3;
            //Act
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            instance.handleChangeSelect(event);

            // Assert
            expect(container.instance().state.selectedStage).toEqual(2);
        });
    });
});