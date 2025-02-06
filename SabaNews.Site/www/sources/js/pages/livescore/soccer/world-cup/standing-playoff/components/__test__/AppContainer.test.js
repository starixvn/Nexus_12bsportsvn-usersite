import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from '../AppContainer';



describe('AppContainer', () => {
    const defaultProps = {
        matches: [],
        league: {},
        stages: [],
        getMatches: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('constructor', () => {
        afterEach(() => {
            window.innerWidth = 0;
        });

        it('inital correctly state when innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 600;

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('inital correctly state when innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('inital correctly state when innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1030;

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: false });
        });
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.handleResize = jest.fn();

            // Act
            instance.componentDidMount();

            // Assert
            expect(window.addEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('componentWillUnmount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.removeEventListener = jest.fn();

            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('handleResize', () => {
        it('updates correctly state when isMobile = false and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('do nothing when isMobile = true and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('do nothing when isMobile = true and window.innerWidth = 768', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1030;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: false });
        });
    });

    describe('getPlayoffStages', () => {
        it('return correctly stage when call function', () => {
            // Arrange
            const props = {
                ...defaultProps,
                stages: [
                    { stageId: 1, stageNameEN: 'stage1', mode: 1, orderIndex: 0 }, { stageId: 2, stageNameEN: 'stage2', mode: 1, orderIndex: 1 },
                    { stageId: 3, stageNameEN: 'third place', mode: 2, orderIndex: 2 }, { stageId: 30539, stageNameEN: 'stage3', mode: 2, orderIndex: 3 }
                ]
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getPlayoffStages();

            // Assert
            expect(result).toEqual([{ stageId: 30539, stageNameEN: 'stage3', mode: 2, orderIndex: 3 }]);
        });
    });

    describe('groupMatchByStage', () => {
        it('return as expected when season = null and stage = null', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    stage: { stageId: 1, stageNameEN: 'stage' },
                },
                {
                    matchId: 2,
                    stage: { stageId: 2, stageNameEN: 'stage' },
                },
                {
                    matchId: 3,
                    stage: { stageId: 1, stageNameEN: 'stage' },
                }
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const playoffStages = [
                { stageId: 1, orderIndex: 1 }, { stageId: 2, orderIndex: 2 }, { stageId: 10, orderIndex: 10 }
            ]

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.getPlayoffStages = jest.fn().mockReturnValue(playoffStages);
            instance.getFinalAndPlaceMatch = jest.fn().mockReturnValue('final');
            // Act
            const result = instance.groupMatchByStage();

            // Assert
            expect(result).toEqual([
                {
                    key: 1,
                    isFinished: false,
                    stage: { stageId: 1, stageNameEN: 'stage' },
                    matches: [
                        {
                            matchId: 1,
                            stage: { stageId: 1, stageNameEN: 'stage' },
                            league: { leagueId: 1 }
                        },
                        {
                            matchId: 3,
                            stage: { stageId: 1, stageNameEN: 'stage' },
                            league: { leagueId: 1 }
                        }
                    ]
                },
                {
                    key: 2,
                    isFinished: false,
                    stage: { stageId: 2, stageNameEN: 'stage' },
                    matches: [
                        {
                            matchId: 2,
                            stage: { stageId: 2, stageNameEN: 'stage' },
                            league: { leagueId: 1 }
                        },
                    ]
                }
            ]);
        });
    });

    describe('groupMatches', () => {
        it('return correctly when call function', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    stage: { stageId: 1, stageNameEN: 'stage' },
                },
                {
                    matchId: 2,
                    stage: { stageId: 2, stageNameEN: 'stage' },
                },
                {
                    matchId: 3,
                    stage: { stageId: 1, stageNameEN: 'stage' },
                }
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const playoffStages = [
                { key: 1, stage: { stageId: 1 }, matches: [{ matchId: 1 }, { matchId: 2 }] },
                { key: 2, stage: { stageId: 2 }, matches: [{ matchId: 3 }, { matchId: 4 }] }
            ]
            const groupSecondLegMatches = [{ matchId: 1 }, { matchId: 2 }];

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupMatchByStage = jest.fn().mockReturnValue(playoffStages);
            instance.groupMatchBySecondLeg = jest.fn().mockReturnValue(groupSecondLegMatches);
            instance.sortMatchByLastStage = jest.fn().mockReturnValue(groupSecondLegMatches);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual([
                {
                    key: 1,
                    stage: { stageId: 1 },
                    matches: [
                        { matchId: 1 }, { matchId: 2 },
                    ]
                },
                {
                    key: 2,
                    stage: { stageId: 2 },
                    matches: [
                        { matchId: 1}, { matchId: 2 },
                    ]
                }
            ]);
        });
    });

    describe('sortMatchByLastStage', () => {
        it('return correctly data when call function', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                },
                {
                    matchId: 2,
                    homeTeam: { teamId: 3 },
                    awayTeam: { teamId: 4 },
                    stage: { stageId: 2, stageNameEN: 'stage' },
                },
                {
                    matchId: 3,
                    homeTeam: { teamId: 5 },
                    awayTeam: { teamId: 6 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                }
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const lastStage = [
                {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                },
                {
                    matchId: 2,
                    homeTeam: { teamId: 3 },
                    awayTeam: { teamId: 4 },
                }
            ];
            const matchMapWithStage = {
                match: {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                },
                matchIds: [1, 2]
            };

            const matchMapWithStageEmpty = {
                match: null,
                matchIds: [1, 2]
            };

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.getMatchMapWithStage = jest.fn().mockReturnValueOnce(matchMapWithStage)
                .mockReturnValueOnce(matchMapWithStageEmpty)
                .mockReturnValueOnce(matchMapWithStage)
                .mockReturnValueOnce(matchMapWithStageEmpty);

            // Act
            const result = instance.sortMatchByLastStage(matches, lastStage);

            // Assert
            expect(result).toEqual([
                { "awayTeam": { "teamId": 2 }, "homeTeam": { "teamId": 1 }, "matchId": 1 },
                { "awayTeam": { "teamId": 2 }, "homeTeam": { "teamId": 1 }, "matchId": 1 },
                { "awayTeam": { "teamId": 6 }, "homeTeam": { "teamId": 5 }, "isDraw": false, "matchId": 3, "stage": { "stageId": 1, "stageNameEN": 'stage' } }
            ]);
        });
    });

    describe('groupMatchBySecondLeg', () => {
        it('return exacly data when isOutMatches = true', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                    isSecondLeg: false
                },
                {
                    matchId: 2,
                    homeTeam: { teamId: 2 },
                    awayTeam: { teamId: 1 },
                    stage: { stageId: 2, stageNameEN: 'stage' },
                    isSecondLeg: true
                },
                {
                    matchId: 3,
                    homeTeam: { teamId: 5 },
                    awayTeam: { teamId: 6 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                    isSecondLeg: false
                }
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.groupMatchBySecondLeg(matches, true);

            // Assert
            expect(result).toEqual([
                {
                    awayTeam: { teamId: 2 },
                    homeTeam: { teamId: 1 },
                    isDraw: false,
                    isSecondLeg: false,
                    matchId: 1,
                    secondLeg: { awayTeam: { teamId: 1 }, homeTeam: { teamId: 2 }, isSecondLeg: true, matchId: 2, stage: { stageId: 2, stageNameEN: 'stage' } }, stage: { stageId: 1, stageNameEN: 'stage' }
                },
                {
                    awayTeam: { teamId: 6 },
                    homeTeam: { teamId: 5 },
                    isDraw: false,
                    isSecondLeg: false,
                    matchId: 3,
                    stage: { stageId: 1, stageNameEN: 'stage' }
                }
            ]);
        });

        it('return exacly data when isOutMatches = false', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                    isSecondLeg: false,
                },
                {
                    matchId: 2,
                    homeTeam: { teamId: 2 },
                    awayTeam: { teamId: 1 },
                    stage: { stageId: 2, stageNameEN: 'stage' },
                    isSecondLeg: true
                },
                {
                    matchId: 3,
                    homeTeam: { teamId: 5 },
                    awayTeam: { teamId: 6 },
                    stage: { stageId: 1, stageNameEN: 'stage' },
                    isSecondLeg: false
                }
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.groupMatchBySecondLeg(matches, false);

            // Assert
            expect(result).toEqual([
                {
                    awayTeam: { teamId: 2 }, homeTeam: { teamId: 1 }, isSecondLeg: false, matchId: 1,
                    secondLeg: { awayTeam: { teamId: 1 }, homeTeam: { teamId: 2 }, isSecondLeg: true, matchId: 2, stage: { stageId: 2, stageNameEN: 'stage' } }, stage: { stageId: 1, stageNameEN: 'stage' }
                },
                { awayTeam: { teamId: 6 }, homeTeam: { teamId: 5 }, isSecondLeg: false, matchId: 3, stage: { stageId: 1, stageNameEN: 'stage' } }
            ]);
        });
    });

    describe('getMatchMapWithStage', () => {
        it('return correctly data when have one match', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    homeTeam: { teamId: 1 },
                    awayTeam: { teamId: 2 },
                    stage: { stageId: 1 },
                    isSecondLeg: false,
                    stage: { stageNameEN: 'stage' }
                },
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchMapWithStage(matches);

            // Assert
            expect(result.match).toEqual(matches[0]);
            expect(result.matchIds).toEqual([1]);
        });

        it('return correctly data when have two match', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    isSecondLeg: false,
                    stage: { stageNameEN: 'stage' }
                },
                {
                    matchId: 2,
                    isSecondLeg: true,
                    stage: { stageNameEN: 'stage' }
                },
            ];

            const props = {
                ...defaultProps,
                matches: matches,
                league: { leagueId: 1 }
            }

            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchMapWithStage(matches);

            // Assert
            expect(result.match).toEqual({ isSecondLeg: false, matchId: 1, stage: { stageNameEN: 'stage' }, secondLeg: { isSecondLeg: true, matchId: 2, stage: { stageNameEN: 'stage' } } });
            expect(result.matchIds).toEqual([1, 2]);
        });
    });

    describe('separateMatches', () => {
        it('return correctly when isPrev = false', () => {
            // Arrange
            const stages = [
                {
                    stage: { stageId: 1 },
                    matches: [
                        { matchId: 1 }, { matchId: 2 },
                    ]
                },
                {
                    stage: { stageId: 2 },
                    matches: [
                        { matchId: 1 }, { matchId: 2 },
                    ]
                }
            ];


            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.separateMatches(stages, false);

            // Assert
            expect(result).toEqual([
                { matches: [{ matchId: 2 }], stage: { stageId: 1 } },
                { matches: [{ matchId: 2 }], stage: { stageId: 2 } }]);
        });

        it('return correctly when isPrev = true', () => {
            // Arrange
            const stages = [
                {
                    stage: { stageId: 1 },
                    matches: [
                        { matchId: 1 }, { matchId: 2 },
                    ]
                },
                {
                    stage: { stageId: 2 },
                    matches: [
                        { matchId: 1 }, { matchId: 2 },
                    ]
                }
            ];


            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.separateMatches(stages, true);

            // Assert
            expect(result).toEqual([
                { matches: [{ matchId: 1 }], stage: { stageId: 1 } },
                { matches: [{ matchId: 1 }], stage: { stageId: 2 } }]);
        });
    });

    describe('sortMatches', () => {
        it('return correctly data', () => {
             // Arrange
            const groups = [
                {key: 30538, matches:[{matchId: 55225419}, {matchId: 55225418}, {matchId: 55225422}, {matchId: 55225423}, {matchId: 55225420}, {matchId: 55225421}, {matchId: 55225424}, {matchId: 55225426}]},
                {key: 30539, matches: [{matchId: 55225428}, {matchId: 55225430}, {matchId: 55225427}, {matchId: 55225429}]},
                {key: 30540, matches: [{matchId: 55225431}, {matchId: 56772779}]}
            ];
            const expected = [
                {key: 30538, matches:[{matchId: 55225418}, {matchId: 55225419}, {matchId: 55225422}, {matchId: 55225423}, {matchId: 55225420}, {matchId: 55225421}, {matchId: 55225424}, {matchId: 55225426}]},
                {key: 30539, matches: [{matchId: 55225428}, {matchId: 55225427}, {matchId: 55225430}, {matchId: 55225429}]},
                {key: 30540, matches: [{matchId: 55225431}, {matchId: 56772779}]}
            ]
             const container = shallow(<AppContainer {...defaultProps} />);
             const instance = container.instance();
             // Act
             const result = instance.sortMatches(groups);
 
             // Assert
             expect(result).toEqual(expected);
        });
    });

    describe('renders', () => {
        it('render empty with default props', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render empty when match is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: null
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when isMobile = true', () => {
            // Arrange
            const matches = [{ matchId: 1, stage: { stageNameEN: 'stage' } }, { matchId: 2, stage: { stageNameEN: 'stage' } }]
            const props = {
                ...defaultProps,
                matches: matches
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupMatches = jest.fn().mockReturnValue(matches);
            instance.separateMatches = jest.fn().mockReturnValue(matches);
            instance.setState({ isMobile: true });
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when isMobile = false', () => {
            // Arrange
            const matches = [{ matchId: 1, stage: { stageNameEN: 'stage' } }, { matchId: 2, stage: { stageNameEN: 'stage' } }]
            const props = {
                ...defaultProps,
                matches: matches
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.groupMatches = jest.fn().mockReturnValue(matches);
            instance.separateMatches = jest.fn().mockReturnValue(matches);
            instance.getFinalAndPlaceMatch = jest.fn().mockReturnValue('final');
            instance.setState({ isMobile: false });
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});