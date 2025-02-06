import React from 'react';
import { shallow } from 'enzyme';
import CommonFunctions from '@jsroot/common/common-functions';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        standings: null
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initSelectedLeagueId', () => {
        it('return correct default stageId', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.initSelectedLeagueId();

            // Assert
            expect(result).toEqual(2);
        })
    });
    describe('handleSelectLeague', () => {
        it('setState correctly when call function', () =>  {
            // Arrange
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.handleSelectLeague(3);

            // Assert
            expect(instance.state.selectedLeagueId).toEqual(3);
        });
    })

    describe('getLeagueStanding', () => {
        it('return correct standing when call function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getLeagueStanding();

            // Assert
            expect(result).toEqual({
                league:{leagueId: 2},
                standing: [{stageId: 1}]
            });
        })
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
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Grid {...props} />);

            // Act
            container.find('.block__title').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url');
        });

        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1},
                        standing: []
                    },
                    {
                        league:{leagueId: 2},
                        standing: [{stageId: 1}]
                    }
                ]
            }
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Grid {...props} />);

            // Act
            container.find('.view-more-block').simulate('click', event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });
    });

    describe('renders', () => {
        it('render correct when isMobile = true', () => {
            // Arrange
            window.innerWidth = 500;
            const props = {
                ...defaultProps,
                standings:[
                    {
                        league:{leagueId: 1231231},
                        standing: [{stageId: 1}]
                    },
                    {
                        league:{leagueId: 2, leagueNameVN:'league name'},
                        standing: [{stageId: 1}, {stageId: 2}]
                    }
                ]
            }
            // Act
            const container = shallow(<Grid {...props} />);
            container.find('.season-standings select').simulate('change', {target: {value: 'value'}});

            // Assert
            expect(container).toMatchSnapshot();
        })
    });
})