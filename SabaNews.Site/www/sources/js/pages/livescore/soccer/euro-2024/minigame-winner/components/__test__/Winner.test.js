import React from 'react';
import { shallow } from 'enzyme';
import Winner from '../Winner';

describe('Winner', () => {
    beforeAll(() => {
        const appContainer = document.createElement('div');
        appContainer.setAttribute('class', 'detailWinners');
        document.body.appendChild(appContainer);

        const appContainer2 = document.createElement('div');
        appContainer2.setAttribute('class', 'detailWinners');
        document.body.appendChild(appContainer2);
    });

    afterAll(() => {
        const appContainer = document.getElementsByClassName('detailWinners');
        if (appContainer) {
            document.body.removeChild(appContainer);
        }
        jest.clearAllMocks();
    });

    it('return correctly when data is empty', () => {
        // Arrange           
        const defaultProps = {
            matches: [],
            votes: [],
            selectedStage: 0
        };
        const container = shallow(<Winner {...defaultProps} />);

        // Act
        const instance = container.instance().calculatorPointer(defaultProps.matches, defaultProps.votes);

        // Assert 
        expect(instance).toEqual([]);
    });

    it('return correctly when data is not empty', () => {
        window.location.hash = '#stage-minigame';
        window.rank = 1;
        // Arrange           
        const defaultProps = {
            matches: [{
                awayTeam:{
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/9209eacc8b736944a345d57b881f2c65.png",
                    iconVN: null,
                    leagueId: 0,
                    teamFullNameEN: "Senegal",
                    teamId: 33992,
                    teamNameEN: "Senegal",
                    teamNameVN: null
                },
                awayTeamAggregateScore: 0,
                awayTeamExtraScore: 0,
                awayTeamHalfScore: 1,
                awayTeamPenaltyScore: 0,
                awayTeamTotalScore: 2,
                endTime: "2022-11-29T18:00:00",
                footballAddStartTime: null,
                footballNextHalfStartTime: "2022-11-29T16:06:39",
                footballStartTime: "2022-11-29T15:01:05",
                groupNum: 1,
                homeTeam: {
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/316ed60858ba245efe1a39cbfe5c2a97.png",
                    iconVN: "http://localhost:17323//uploads/team/8361024px-FlagofBelgium.svg.png",
                    leagueId: 0,
                    teamFullNameEN: "Ecuador",
                    teamId: 53991,
                    teamNameEN: "Ecuador",
                    teamNameVN: null
                },
                homeTeamAggregateScore: 0,
                homeTeamExtraScore: 0,
                homeTeamHalfScore: 0,
                homeTeamPenaltyScore: 0,
                homeTeamTotalScore: 1,
                isFavourite: false,
                isSecondLeg: false,
                league: null,
                matchId: 55225403,
                round: 3,
                season: null,
                stage: {
                    groupCount: 8,
                    mode: 1,
                    orderIndex: 1,
                    roundCount: 3,
                    stageId: 30537,
                    stageNameCustom: null,
                    stageNameEN: "Groups",
                    stageNameResource: null,
                    stageNameVN: "Vòng Bảng"
                },
                startTime: "2022-11-29T15:00:00",
                status: 50,
            },
            {
                awayTeam:{
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/9209eacc8b736944a345d57b881f2c65.png",
                    iconVN: null,
                    leagueId: 0,
                    teamFullNameEN: "Senegal",
                    teamId: 33992,
                    teamNameEN: "Senegal",
                    teamNameVN: null
                },
                awayTeamAggregateScore: 0,
                awayTeamExtraScore: 0,
                awayTeamHalfScore: 1,
                awayTeamPenaltyScore: 0,
                awayTeamTotalScore: 2,
                endTime: "2022-11-29T18:00:00",
                footballAddStartTime: null,
                footballNextHalfStartTime: "2022-11-29T16:06:39",
                footballStartTime: "2022-11-29T15:01:05",
                groupNum: 1,
                homeTeam: {
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/316ed60858ba245efe1a39cbfe5c2a97.png",
                    iconVN: "http://localhost:17323//uploads/team/8361024px-FlagofBelgium.svg.png",
                    leagueId: 0,
                    teamFullNameEN: "Ecuador",
                    teamId: 53991,
                    teamNameEN: "Ecuador",
                    teamNameVN: null
                },
                homeTeamAggregateScore: 0,
                homeTeamExtraScore: 0,
                homeTeamHalfScore: 0,
                homeTeamPenaltyScore: 0,
                homeTeamTotalScore: 1,
                isFavourite: false,
                isSecondLeg: false,
                league: null,
                matchId: 55225404,
                round: 3,
                season: null,
                stage: {
                    groupCount: 8,
                    mode: 1,
                    orderIndex: 1,
                    roundCount: 3,
                    stageId: 30538,
                    stageNameCustom: null,
                    stageNameEN: "Groups",
                    stageNameResource: null,
                    stageNameVN: "Vòng Bảng"
                },
                startTime: "2022-11-29T15:00:00",
                status: 50,
            }],
            votes: [{
                createdDate: "2022-11-30T01:70:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225403,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:10:33",
                userId: 990060,
                userName: "nguyen manh cuong cuong cuong cuong "
            },
            {
                createdDate: "2022-11-30T01:56:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225404,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:10:33",
                userId: 990060,
                userName: "nguyen manh cuong cuong cuong cuong "
            },
            {
                createdDate: "2022-11-30T01:58:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225403,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:10:33",
                userId: 990061,
                userName: "nguyen manh cuong cuong cuong cuong "
            },
            {
                createdDate: "2022-11-30T01:59:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225404,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:10:33",
                userId: 990061,
                userName: "nguyen manh cuong cuong cuong cuong "
            }],
            selectedStage: 1
        };
        const container = shallow(<Winner {...defaultProps} />);

        // Act
        const instance = container.instance().calculatorPointer(defaultProps.matches, defaultProps.votes);

        // Assert 
        expect(instance.length).toEqual(2);
    });

    it('return correctly when data is not empty and 1 math not finish', () => {
        // Arrange           
        window.location.hash = '#minigame-standing';
        window.rank = 1;
        const defaultProps = {
            matches: [{
                awayTeam:{
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/9209eacc8b736944a345d57b881f2c65.png",
                    iconVN: null,
                    leagueId: 0,
                    teamFullNameEN: "Senegal",
                    teamId: 33992,
                    teamNameEN: "Senegal",
                    teamNameVN: null
                },
                awayTeamAggregateScore: 0,
                awayTeamExtraScore: 0,
                awayTeamHalfScore: 1,
                awayTeamPenaltyScore: 0,
                awayTeamTotalScore: 2,
                endTime: "2022-11-29T18:00:00",
                footballAddStartTime: null,
                footballNextHalfStartTime: "2022-11-29T16:06:39",
                footballStartTime: "2022-11-29T15:01:05",
                groupNum: 1,
                homeTeam: {
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/316ed60858ba245efe1a39cbfe5c2a97.png",
                    iconVN: "http://localhost:17323//uploads/team/8361024px-FlagofBelgium.svg.png",
                    leagueId: 0,
                    teamFullNameEN: "Ecuador",
                    teamId: 53991,
                    teamNameEN: "Ecuador",
                    teamNameVN: null
                },
                homeTeamAggregateScore: 0,
                homeTeamExtraScore: 0,
                homeTeamHalfScore: 0,
                homeTeamPenaltyScore: 0,
                homeTeamTotalScore: 1,
                isFavourite: false,
                isSecondLeg: false,
                league: null,
                matchId: 55225403,
                round: 3,
                season: null,
                stage: {
                    groupCount: 8,
                    mode: 1,
                    orderIndex: 1,
                    roundCount: 3,
                    stageId: 30537,
                    stageNameCustom: null,
                    stageNameEN: "Groups",
                    stageNameResource: null,
                    stageNameVN: "Vòng Bảng"
                },
                startTime: "2022-11-29T15:00:00",
                status: 50,
            },
            {
                awayTeam:{
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/9209eacc8b736944a345d57b881f2c65.png",
                    iconVN: null,
                    leagueId: 0,
                    teamFullNameEN: "Senegal",
                    teamId: 33992,
                    teamNameEN: "Senegal",
                    teamNameVN: null
                },
                awayTeamAggregateScore: 0,
                awayTeamExtraScore: 0,
                awayTeamHalfScore: 1,
                awayTeamPenaltyScore: 0,
                awayTeamTotalScore: 2,
                endTime: "2022-11-29T18:00:00",
                footballAddStartTime: null,
                footballNextHalfStartTime: "2022-11-29T16:06:39",
                footballStartTime: "2022-11-29T15:01:05",
                groupNum: 1,
                homeTeam: {
                    icon: "https://sports-cdn.zgsmxw.com/uploads/teamIcon/0000/316ed60858ba245efe1a39cbfe5c2a97.png",
                    iconVN: "http://localhost:17323//uploads/team/8361024px-FlagofBelgium.svg.png",
                    leagueId: 0,
                    teamFullNameEN: "Ecuador",
                    teamId: 53991,
                    teamNameEN: "Ecuador",
                    teamNameVN: null
                },
                homeTeamAggregateScore: 0,
                homeTeamExtraScore: 0,
                homeTeamHalfScore: 0,
                homeTeamPenaltyScore: 0,
                homeTeamTotalScore: 1,
                isFavourite: false,
                isSecondLeg: false,
                league: null,
                matchId: 55225404,
                round: 3,
                season: null,
                stage: {
                    groupCount: 8,
                    mode: 1,
                    orderIndex: 1,
                    roundCount: 3,
                    stageId: 30537,
                    stageNameCustom: null,
                    stageNameEN: "Groups",
                    stageNameResource: null,
                    stageNameVN: "Vòng Bảng"
                },
                startTime: "2022-11-29T15:00:00",
                status: 50,
            }],
            votes: [
                {
                    createdDate: "2022-11-30T01:59:00",
                    email: "hank.nguyen@starixvn.com",
                    icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                    matchId: 55225404,
                    point: 0,
                    stage: 1,
                    teamId: 53991,
                    updatedDate: "2022-11-30T04:19:33",
                    userId: 990061,
                    userName: "nguyen manh cuong cuong cuong cuong "
                },
                {
                createdDate: "2022-11-30T01:70:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225403,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:10:33",
                userId: 990060,
                userName: "nguyen manh cuong cuong cuong cuong "
            },
            {
                createdDate: "2022-11-30T01:56:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225404,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:16:33",
                userId: 990060,
                userName: "nguyen manh cuong cuong cuong cuong "
            },
            {
                createdDate: "2022-11-30T01:58:00",
                email: "hank.nguyen@starixvn.com",
                icon: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1481481742358577&height=50&width=50&ext=1671204847&hash=AeR_hSaBzXjeVyWm6jw",
                matchId: 55225403,
                point: 0,
                stage: 1,
                teamId: 33992,
                updatedDate: "2022-11-30T04:15:33",
                userId: 990061,
                userName: "nguyen manh cuong cuong cuong cuong "
            }],
            selectedStage: 1
        };
        const container = shallow(<Winner {...defaultProps} />);

        // Act
        const instance = container.instance().calculatorPointer(defaultProps.matches, defaultProps.votes);

        // Assert 
        expect(instance.length).toEqual(2);
    });
});