import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Standing } from '../Standing';

describe('Standing', () => {
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
            const instance = shallow(<Standing {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when window.innerWidth = 580', () => {
            // Arrange
            window.innerWidth = 580;

            // Act
            const instance = shallow(<Standing {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when window.innerWidth > 580', () => {
            // Arrange
            window.innerWidth = 581;

            // Act
            const instance = shallow(<Standing {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<Standing {...defaultProps} />);
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

            const container = shallow(<Standing {...defaultProps} />);
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
            const container = shallow(<Standing {...defaultProps} />);
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
            const container = shallow(<Standing {...defaultProps} />);
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
            const container = shallow(<Standing {...defaultProps} />);
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
            const container = shallow(<Standing {...defaultProps} />);
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
            const container = shallow(<Standing {...defaultProps} />);
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

            const container = shallow(<Standing {...defaultProps} />);
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
        it('return as expected when group league is cup', () => {
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

            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByStage(seasonStandings);

            // Assert
            expect(result.length).toEqual(2);
            expect(result.standing).toEqual(
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
                        }
                    ]
                }
            );
        });

        it('return as expected when group league is league and length < 5', () => {
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
            ];

            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByStage(seasonStandings);

            // Assert
            expect(result.length).toEqual(1);
            expect(result.standing).toEqual(
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
                }
            );
        });

        it('return as expected when group league is league and length > 5', () => {
            // Arrange
            const seasonStandings = [
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                    groupName: 'A', teamId: 1, position: 1, promotion: null
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                    groupName: 'A', teamId: 2, position: 2, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                    groupName: 'A', teamId: 21, position: 3, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                    groupName: 'A', teamId: 2, position: 4, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                    groupName: 'A', teamId: 1, position: 5, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 6,
                    groupName: 'A', teamId: 2, position: 6, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
            ];

            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByStage(seasonStandings);

            // Assert
            expect(result.length).toEqual(1);
            expect(result.standing).toEqual(
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
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                                    groupName: 'A', teamId: 2, position: 2, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                                    groupName: 'A', teamId: 21, position: 3, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                                    groupName: 'A', teamId: 2, position: 4, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                                    groupName: 'A', teamId: 1, position: 5, promotion: null
                                }
                            ]
                        }
                    ]
                }
            );
        });

        it('return as expected when group standing length = 0', () => {
            // Arrange
            const seasonStandings = [
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                    groupName: 'A', teamId: 1, position: 1, promotion: null
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                    groupName: 'A', teamId: 2, position: 2, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                    groupName: 'A', teamId: 21, position: 3, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                    groupName: 'A', teamId: 2, position: 4, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                    groupName: 'A', teamId: 1, position: 5, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
                {
                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 6,
                    groupName: 'A', teamId: 2, position: 6, promotion: "{ \"Id\": 2, \"Color\": \"\", \"NameEN\": \"AFC Cup\" }"
                },
            ];

            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByStage(seasonStandings);

            // Assert
            expect(result.length).toEqual(1);
            expect(result.standing).toEqual(
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
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                                    groupName: 'A', teamId: 2, position: 2, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                                    groupName: 'A', teamId: 21, position: 3, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                                    groupName: 'A', teamId: 2, position: 4, promotion: null
                                },
                                {
                                    stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                                    groupName: 'A', teamId: 1, position: 5, promotion: null
                                }
                            ]
                        }
                    ]
                }
            );
        });
    });

    describe('renders', () => {
        it('render correctly when standing length > 0', () => {
            // Arrange
            const standing = {
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
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                                groupName: 'A', teamId: 2, position: 2, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                                groupName: 'A', teamId: 21, position: 3, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                                groupName: 'A', teamId: 2, position: 4, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                                groupName: 'A', teamId: 1, position: 5, promotion: null
                            }
                        ]
                    }
                ]
            }
            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();
            instance.groupStandingsByStage = jest.fn().mockReturnValue({length: 1, standing, lengthChild: 2});

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when standing length > 1', () => {
            // Arrange
            const standing = {
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
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 2,
                                groupName: 'A', teamId: 2, position: 2, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 3,
                                groupName: 'A', teamId: 21, position: 3, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 4,
                                groupName: 'A', teamId: 2, position: 4, promotion: null
                            },
                            {
                                stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 5,
                                groupName: 'A', teamId: 1, position: 5, promotion: null
                            }
                        ]
                    }
                ]
            }
            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();
            instance.groupStandingsByStage = jest.fn().mockReturnValue({length: 2, standing, lengthChild: 2});

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when standing length = 0', () => {
            // Arrange
            const container = shallow(<Standing {...defaultProps} />);
            const instance = container.instance();
            instance.groupStandingsByStage = jest.fn().mockReturnValue({length: 0, standing: {}, lengthChild: 2});

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })
});