import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import WeekDay from '../WeekDay';

describe('WeekDay', () => {
    afterEach(() => {
        window.isLivePage = false;
        jest.clearAllMocks();
    });

    it('renders correctly when selectedDate = currentDate', () => {
        // Arrange
        const props = {
            isMobile: false,
            today: '2022-05-25',
            selectedDate: '2022-05-26',
            currentDate: '2022-05-26',
            onClick: jest.fn()
        };

        // Act
        const container = shallow(<WeekDay {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when today = currentDate', () => {
        // Arrange
        const props = {
            isMobile: false,
            today: '2022-05-25',
            selectedDate: '2022-05-26',
            currentDate: '2022-05-25',
            onClick: jest.fn()
        };

        // Act
        const container = shallow(<WeekDay {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when selectedDate = currentDate and today = currentDate', () => {
        // Arrange
        const props = {
            isMobile: false,
            today: '2022-05-25',
            selectedDate: '2022-05-25',
            currentDate: '2022-05-25',
            onClick: jest.fn()
        };

        // Act
        const container = shallow(<WeekDay {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = false', () => {
        // Arrange
        const props = {
            isMobile: false,
            today: '2022-05-25',
            selectedDate: '2022-05-25',
            currentDate: '2022-05-26',
            onClick: jest.fn()
        };

        // Act
        const container = shallow(<WeekDay {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = true', () => {
        // Arrange
        const props = {
            isMobile: true,
            today: '2022-05-25',
            selectedDate: '2022-05-25',
            currentDate: '2022-05-26',
            onClick: jest.fn()
        };

        // Act
        const container = shallow(<WeekDay {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('calls correctly function when click on element', () => {
        // Arrange
        const props = {
            isMobile: false,
            today: '2022-05-25',
            selectedDate: '2022-05-25',
            currentDate: '2022-05-26',
            onClick: jest.fn()
        };
        const container = shallow(<WeekDay {...props} />);

        // Act
        container.find('div.week-date').simulate('click');

        // Assert
        expect(props.onClick).toHaveBeenCalledWith('2022-05-26');
    });
});