import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { SeasonStandings } from '../index';

describe('Index', () => {
    const promise = Promise.resolve([]);
    const defaultProps = {
        seasonStandings: [],
        stages: [],
        getSeasonStandings: jest.fn(() => promise)
    };

    beforeAll(() => {
        window.getMatchByStageParams = {
            leagueId: 1,
            seasonId: 1
        };
    });

    afterAll(() => {
        window.getMatchByStageParams = null;
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        afterEach(() => {
            window.innerWidth = 0;
        });

        it('inital correctly state when window.innerWidth < 580', () => {
            // Arrange
            window.innerWidth = 579;

            // Act
            const instance = shallow(<SeasonStandings {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when window.innerWidth = 580', () => {
            // Arrange
            window.innerWidth = 580;

            // Act
            const instance = shallow(<SeasonStandings {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when window.innerWidth > 580', () => {
            // Arrange
            window.innerWidth = 581;

            // Act
            const instance = shallow(<SeasonStandings {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.handleResize = jest.fn();

            // Act
            instance.componentDidMount();

            // Assert
            expect(window.addEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
            expect(defaultProps.getSeasonStandings).toHaveBeenCalledWith({ leagueId: 1, seasonId: 1 });
        });
    });

    describe('componentWillUnmount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.removeEventListener = jest.fn();

            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('handleResize', () => {
        it('updates correctly state when isMobile = false and window.innerWidth < 580', () => {
            // Arrange
            window.innerWidth = 579;
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 580', () => {
            // Arrange
            window.innerWidth = 580;
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth < 580', () => {
            // Arrange
            window.innerWidth = 579;
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth = 580', () => {
            // Arrange
            window.innerWidth = 580;
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 580', () => {
            // Arrange
            window.innerWidth = 581;
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('groupStandingsByGroupName', () => {
        it('return as expected', () => {
            // Arrange
            const seasonStandings = [
                { groupName: 'A', teamId: 1, position: 1 },
                { groupName: 'B', teamId: 2, position: 1 },
                { groupName: 'A', teamId: 3, position: 2 }
            ];

            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByGroupName(seasonStandings);

            // Assert
            expect(result).toEqual([
                {
                    key: 'A',
                    childs: [
                        { groupName: 'A', teamId: 1, position: 1 },
                        { groupName: 'A', teamId: 3, position: 2 }
                    ]
                },
                {
                    key: 'B',
                    childs: [
                        { groupName: 'B', teamId: 2, position: 1 },
                    ]
                }
            ]);
        });
    });

    describe('groupStandingsByStage', () => {
        it('return as expected', () => {
            // Arrange
            const seasonStandings = [
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                    groupName: 'A', teamId: 1, position: 1, promotion: null
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                    groupName: 'A', teamId: 2, position: 2, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                    groupName: 'A', teamId: 3, position: 1, promotion: "{ \"Id\": 1, \"Color\": \"#00CCFF\", \"NameEN\": \"UEFA Cup\" }"
                },
                {
                    stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                    groupName: 'B', teamId: 4, position: 2, promotion: null
                }
            ];

            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByStage(seasonStandings);

            // Assert
            expect(result).toEqual([
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                    childs: [
                        {
                            key: 'A',
                            childs: [
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                                    groupName: 'A', teamId: 1, position: 1, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                                    groupName: 'A', teamId: 2, position: 2, promotion: null
                                }
                            ]
                        }
                    ]
                },
                {
                    stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                    childs: [
                        {
                            key: 'A',
                            childs: [
                                {
                                    stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                                    groupName: 'A', teamId: 3, position: 1, promotion: { Id: 1, Color: '#00CCFF', NameEN: 'UEFA Cup' }
                                }
                            ]
                        },
                        {
                            key: 'B',
                            childs: [
                                {
                                    stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                                    groupName: 'B', teamId: 4, position: 2, promotion: null
                                }
                            ]
                        }
                    ]
                }
            ]);
        });
    });

    describe('getPromotionStandings', () => {
        it('return as expected', () => {
            // Arrange
            const seasonStandings = [
                { groupName: 'A', teamId: 1, position: 1, promotion: null },
                { groupName: 'A', teamId: 2, position: 2, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }" },
                { groupName: 'B', teamId: 3, position: 1, promotion: "{ \"Id\": 1, \"Color\": \"#00CCFF\", \"NameEN\": \"UEFA Cup\" }" },
                { groupName: 'B', teamId: 4, position: 2, promotion: "{ \"Id\": 3, \"Color\": \"#57A87B\", \"NameEN\": \"AFC Cup Playoffs\" }" }
            ];

            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getPromotionStandings(seasonStandings);

            // Assert
            expect(result).toEqual([
                { Id: 1, Color: '#00CCFF', NameEN: 'UEFA Cup' },
                { Id: 3, Color: '#57A87B', NameEN: 'AFC Cup Playoffs' }
            ]);
        });
    });

    describe('handleSelectTab', () => {
        it('setState correctly', () => {
            // Arrange
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleSelectTab('fixture');

            // Assert
            expect(instance.state.selectedTab).toEqual('fixture');
        });
    });

    describe('checkShowTab', () => {
        it('return true when standing.length > 1', () => {
            // Arrange
            const seasonStandings = [{stageId: 1}, {stageId: 2}];
            const stages = [{stageId: 1}, {stageId: 2}];
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkShowTab(seasonStandings, stages);

            // Assert
            expect(result).toEqual(true);
        });

        it('return true when has playoff stages', () => {
            // Arrange
            const seasonStandings = [{stageId: 1, orderIndex: 1}];
            const stages = [{stageId: 2, orderIndex: 2, mode: 2}, {stageId: 3, orderIndex: 3, mode: 3}];
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkShowTab(seasonStandings, stages);

            // Assert
            expect(result).toEqual(true);
        });

        it('return false when has not any playoff stages', () => {
            // Arrange
            const seasonStandings = [{stageId: 1, orderIndex: 1}];
            const stages = [];
            const container = shallow(<SeasonStandings {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkShowTab(seasonStandings, stages);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('render', () => {
        it('renders correctly when promotions.length = 0 and stages.length = 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                seasonStandings: [
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: null
                    },
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    }
                ]
            };

            // Act
            const container = shallow(<SeasonStandings {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when promotions.length = 0 and stages.length > 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                seasonStandings: [
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: null
                    },
                    {
                        stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    }
                ]
            };

            // Act
            const container = shallow(<SeasonStandings {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when promotions.length > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                seasonStandings: [
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: "{ \"Id\": 1, \"Color\": \"#00CCFF\", \"NameEN\": \"UEFA Cup\" }"
                    },
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    }
                ]
            };

            // Act
            const container = shallow(<SeasonStandings {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});