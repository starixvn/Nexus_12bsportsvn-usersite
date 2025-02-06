import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { WeekBar } from '../WeekBar';
import Site from '@jsroot/common/site';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('WeekBar', () => {
    let defaultProps = {
        today: '2022-05-25',
        minDate: '2022-01-01',
        maxDate: '2022-12-31',
        selectedDate: '2022-05-25',
        dateRanges: [],
        setDateRanges: jest.fn(),
        setSelectedDate: jest.fn(),
        navigate: jest.fn(),
        onClick: jest.fn()
    };

    beforeAll(() => {
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('onPrev', () => {
        it('calls correctly functions', () => {
            // Arrange
            DateTimeService.formatDateTime = jest.fn(() => '2022-05-24');
            const props = {
                ...defaultProps,
                dateRanges: ['2022-05-25', '2022-05-26']
            };
            const container = shallow(<WeekBar {...props} />);
            const instance = container.instance();

            // Act
            instance.onPrev();

            // Assert
            expect(props.setDateRanges).toHaveBeenCalledWith(['2022-05-24', '2022-05-25']);
        });
    });

    describe('onNext', () => {
        it('calls correctly functions', () => {
            // Arrange
            DateTimeService.formatDateTime = jest.fn(() => '2022-05-27');
            const props = {
                ...defaultProps,
                dateRanges: ['2022-05-25', '2022-05-26']
            };
            const container = shallow(<WeekBar {...props} />);
            const instance = container.instance();

            // Act
            instance.onNext();

            // Assert
            expect(props.setDateRanges).toHaveBeenCalledWith(['2022-05-26', '2022-05-27']);
        });
    });

    describe('onSelectDate', () => {
        it('calls correctly functions', () => {
            // Arrange
            Site.resolveClientUrl = jest.fn(url => url);
            const container = shallow(<WeekBar {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onSelectDate('2022-05-25');

            // Assert
            expect(window.isLivePage).toEqual(false);
            expect(defaultProps.setSelectedDate).toHaveBeenCalledWith('2022-05-25');
            expect(defaultProps.onClick).toHaveBeenCalledWith('2022-05-25');
            expect(defaultProps.navigate).toHaveBeenCalledWith('lich-thi-dau/bong-da/2022-05-25');
        });
    });

    describe('render', () => {
        it('renders correctly with default props', () => {
            // Act
            const container = shallow(<WeekBar {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when dateRanges.length > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                dateRanges: ['2022-05-25', '2022-05-26']
            };

            // Act
            const container = shallow(<WeekBar {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when minDate = dateRanges[0]', () => {
            // Arrange
            const props = {
                ...defaultProps,
                minDate: '2022-05-25',
                dateRanges: ['2022-05-25', '2022-05-26']
            };

            // Act
            const container = shallow(<WeekBar {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when maxDate = dateRanges[dateRanges.length - 1]', () => {
            // Arrange
            const props = {
                ...defaultProps,
                maxDate: '2022-05-26',
                dateRanges: ['2022-05-25', '2022-05-26']
            };

            // Act
            const container = shallow(<WeekBar {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});