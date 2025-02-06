import React from 'react';
import { shallow } from 'enzyme';
import Grid from '../Grid';
import toJson from 'enzyme-to-json';
import CommonFunctions from '@jsroot/common/common-functions';
import { defaultFormat } from 'moment';

describe('Grid', () => {
    const defaultProps = {
        league: {leagueId: 1},
        matches: [{matchId: 1}, {matchId: 2}]
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleClickLeague', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });


        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 12};
            const container = shallow(<Grid {...defaultProps} />);
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');
            // Act
            container.find('.round-name').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da');
        });

        it('calls correctly when ctrlKey = true', () => {
           // Arrange
           const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', season: {seasonId: 123} };
            const container = shallow(<Grid {...defaultProps} />);
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            container.find('.round-name').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('renders', () => {
        it('render correctly ', () => {
            // Act
            const container = shallow(<Grid {...defaultProps} />);

            // Assert
            expect(container).toMatchSnapshot();
        });
    })

})
