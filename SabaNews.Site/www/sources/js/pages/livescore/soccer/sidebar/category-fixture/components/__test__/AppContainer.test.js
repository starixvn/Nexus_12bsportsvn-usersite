import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('AppContainer', () => {
    const defaultProps = {
        league: null,
        matches: [],
        getMatches: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getMatches).toHaveBeenCalledTimes(2);
        });
    })


    describe('handleClickFixture', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });

        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<AppContainer {...defaultProps} />);
            // Act
            container.find('.block__title').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<AppContainer {...defaultProps} />);
            // Act
            container.find('.block__title').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da');
        });
    });


    describe('renders', () => {
        it('render skeleton when match is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                leagues: null
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.checkIsFinished = jest.fn();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when leagues has data', () => {
            // Arrange
            const matches = [{ matchId: 1, status: 0, stage: { stageId: 30537 } }, { matchId: 2, status: 0, stage: { stageId: 0 } }];
            const league = [{
                leagueId: 1,
                season: { endTime: '2022-08-19 05:00:00' },
                currentStageId: 30540,
                leagueNameEN: "name"
            }]
            const props = {
                ...defaultProps,
                leagues: [{league, matches}]
            }
            // Act
            const container = shallow(<AppContainer {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        });
    });
})