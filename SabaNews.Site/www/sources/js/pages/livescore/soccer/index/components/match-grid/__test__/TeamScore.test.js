import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TeamScore from '../TeamScore';

describe('TeamScore', () => {
    const defaultProps = {
        match: {
            homeTeamExtraScore: 2,
            homeTeamTotalScore: 1,
            homeTeamHalfScore: 0
        },
        isHomeTeam: true
    };

    it('renders correctly when match status = NotStarted', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 0 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = Delay', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 60 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = Postpone', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 63 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = Cancel', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 64 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = TBD', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 99 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = Finished', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 50 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match status = Live', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: { ...defaultProps.match, status: 10 }
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when match isHomeTeam = false and ExtraScore = 0', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: {
                ...defaultProps.match,
                awayTeamExtraScore: 0,
                awayTeamTotalScore: 1,
                awayTeamHalfScore: 0,
                status: 50
            },
            isHomeTeam: false
        };

        // Act
        const container = shallow(TeamScore(props));

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});