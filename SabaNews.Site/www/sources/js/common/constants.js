export const MobileMaxWidth = 768;

export const Width1024 = 1024;

export const LeagueType = {
    Unknown: 0,
    League: 1,
    Cup: 2,
    Friendly: 3
};

export const MatchStatus = {
    NotStarted: 0,
    FirstHalf: 10,
    Section1: 11,
    EndOfTheFirstQuater: 12,
    Section2: 13,
    EndOfTheSecondQuater: 14,
    Intermission: 20,
    SecondHalf: 30,
    Section3: 31,
    EndOfTheThirdQuater: 32,
    Section4: 33,
    ExtraTime: 40,
    PenaltyShootout: 41,
    Finished: 50,
    Delay: 60,
    Interrupt: 61,
    CutInHalf: 62,
    Postpone: 63,
    Cancel: 64,
    TBD: 99
};

export const IncidentPosition = {
    Neutral: 0,
    Home: 1,
    Away: 2
}

export const VARResultCode = {
    Unknown: 0,
    GoalValid: 1,
    GoalInValid: 2,
    PenaltyValid: 3,
    PenaltyCancelled: 4,
    RedCardValid: 5,
    RedCardCancelled: 6,
    PlayPenaltyVerification: 7,
    PlayPenaltyChange: 8,
    MaintainOriginalJudgment: 9,
    SendPenaltyChange: 10
}

export const IncidentStatus = {
    Goal: 1,
    YellowCard: 3,
    RedCard: 4,
    Penalty: 8,
    Substitution: 9,
    GameStart: 10,
    Halftime: 11,
    End: 12,
    HalftimeScore: 13,
    YellowTurnRedCard: 15,
    PenaltyMissed: 16,
    OwnGoal: 17,
    InjuryTime:  19,
    ExtraTimeEnd: 26,
    PenaltyShootoutEnd: 27,
    VAR: 28,
    PenaltyShootOut: 29,
    PenaltyShootOutMissed: 30,
    PenaltyShootOutSuccess:31
};

export const IncidentIconType = {
    Goal: 1,
    YellowCard: 3,
    RedCard: 4,
    Penalty: 8,
    YellowTurnRedCard: 15,
    PenaltyMissed: 16,
    OwnGoal: 17,
    VAR: 28,
    PenaltyShootOut: 29,
    PenaltyShootOutMissed: 30,
    PenaltyShootOutSuccess:31,
    outSubsitution: 32,
    inSubsitution: 33
};

export const WorldCup = {
    leagueId: 14638, //[14638, 12062, 12036, 11998, 11997]
    seasonId: 10810, //[10810, 10617, 10375, 10230, 10889]
    EightTeamStage: 30538,
    QuarterfinalsStage: 30539,
    GroupsStage: 30537,
    SemifinalsStage: 30540,
    ThirdPlace: 30541,
    FinalStage: 30542,
    MatchDetailUrl: 'lich-thi-dau/world-cup-2022',
    Title: 'World Cup 2022:',
    EightTeamMatches: [55225418, 55225419, 55225422, 55225423, 55225420, 55225421, 55225424, 55225426],
    QuaterFinalMatches: [55225428, 55225427, 55225430, 55225429],
    SemiFinalMatches: [55225431, 56772779],
    MinigameUrl: 'world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung',
    MinigameDetailUrl: 'world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet',
    MinigameStage: {
        Stage1: 1,
        Stage2: 2,
        Stage3: 3,
        Stage4: 4
    },
    MinigameScore: {
        Final: 20,
        Semifinal: 15,
        Quarterfinal: 12,
        Others: 10
    }
};



export const StageMode = {
    Points: 1,
    Knockout: 2
};

export const MatchResult = {
    Draw: 0,
    Win: 1,
    Lose: 2
}

export const BannerType = {
    DesktopTop: 'banner_desktop_url',
    DesktopLeft: 'banner_desktop_left_url',
    DesktopRight: 'banner_desktop_right_url',
    MobileTop: 'banner_mobile_url',
    MobileCenter: 'banner_mobile_center_url',
    MobileBottom: 'banner_mobile_bottom_url',
}