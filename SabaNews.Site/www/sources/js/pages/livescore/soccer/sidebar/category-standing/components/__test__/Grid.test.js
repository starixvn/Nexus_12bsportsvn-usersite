import React from 'react';
import { shallow } from 'enzyme';
import CommonFunctions from '@jsroot/common/common-functions';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        standing: null,
        league: null
    };

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('handleClickStanding', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });


        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            const props = {
                ...defaultProps,
                league:{leagueId: 1, leagueNameVN: 'name'},
                standing: []
                   
            }
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url/bang-xep-hang');
            const container = shallow(<Grid {...props} />);

            // Act
            container.find('.block__title').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url/bang-xep-hang');
        });

        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            const props = {
                ...defaultProps,
                league:{leagueId: 1, leagueNameVN: 'name'},
                standing: []
            }
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url/bang-xep-hang');
            const container = shallow(<Grid {...props} />);

            // Act
            container.find('.view-more-block').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url/bang-xep-hang', '_blank');
        });
    });

    describe('renders', () => {
        it('render correct when isMobile = true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                league:{leagueId: 1, leagueNameVN: 'name'},
                standing: []
            }
            // Act
            const container = shallow(<Grid {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        })
    });
})