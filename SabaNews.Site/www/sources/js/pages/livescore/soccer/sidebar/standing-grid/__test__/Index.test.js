import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import StandingGrid  from '../Index';

describe('StandingGrid', () => {
    const defaultProps = {
        leagueStanding: {standing:[{stage: 1, promotion: null}]}
    };


    afterAll(() => {
        jest.clearAllMocks();
    });


    describe('groupStandingsByGroupName', () => {
        it('return as expected', () => {
            // Arrange
            const standings = [
                { groupName: 'A', teamId: 1, position: 1 },
                { groupName: 'B', teamId: 2, position: 1 },
                { groupName: 'A', teamId: 3, position: 2 }
            ];

            const container = shallow(<StandingGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupStandingsByGroupName(standings);

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
                    groupName: 'A', teamId: 2, position: 2, promotion: null
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

            const container = shallow(<StandingGrid {...defaultProps} />);
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




    describe('render', () => {
        it('renders correctly when promotions.length = 0 and stages.length = 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                leagueStanding: {standing:[
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: null
                    },
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    }
                ]}
            };

            // Act
            const container = shallow(<StandingGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when promotions.length = 0 and stages.length > 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                leagueStanding: {standing:[
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: null
                    },
                    {
                        stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    },
                    {
                        stageId: 2, stageNameEN: 'Group', stageNameVN: '', orderIndex: 2,
                        groupName: 'B', teamId: 2, position: 2, promotion: null
                    }
                ]}
            };

            // Act
            const container = shallow(<StandingGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when standing have one group', () => {
            // Arrange
            const props = {
                ...defaultProps,
                leagueStanding: {standing: [
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 1, position: 1, promotion: "{ \"Id\": 1, \"Color\": \"#00CCFF\", \"NameEN\": \"UEFA Cup\" }"
                    },
                    {
                        stageId: 1, stageNameEN: 'Qualification', stageNameVN: '', orderIndex: 1,
                        groupName: 'A', teamId: 2, position: 2, promotion: null
                    }
                ]}
            };

            // Act
            const container = shallow(<StandingGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});