import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Index } from '../index';
import Site from '@jsroot/common/site';

describe('index', () => {
    const defaultProps = {
        minDate: '2022-01-01',
        maxDate: '2022-12-31',
        selectedDate: '2022-05-25',
        dateRanges: [],
        setSelectedDate: jest.fn(),
        setDateRanges: jest.fn(),
        onChange: jest.fn(),
        navigate: jest.fn()
    };

    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('inital correctly state', () => {
            // Act
            const instance = shallow(<Index {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ open: false });
        });
    });

    describe('handleToggle', () => {
        it('updates correctly state', () => {
            // Arrange
            const instance = shallow(<Index {...defaultProps} />).instance();

            // Act
            instance.handleToggle();

            // Assert
            expect(instance.state).toEqual({ open: true });
        });
    });

    describe('closeOnScroll', () => {
        it('do nothing when open = false', () => {
            // Arrange
            const instance = shallow(<Index {...defaultProps} />).instance();
            instance.setState = jest.fn();

            // Act
            instance.closeOnScroll();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
        });

        it('updates correctly state when open = true', () => {
            // Arrange
            const instance = shallow(<Index {...defaultProps} />).instance();
            instance.setState({ open: true });

            // Act
            instance.closeOnScroll();

            // Assert
            expect(instance.state).toEqual({ open: false });
        });
    });

    describe('onChange', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('calls correctly functions when dateRanges exclude date', () => {
            // Arrange
            const date = '2022-05-25';
            const props = {
                ...defaultProps,
                dateRanges: ['2022-05-26'],
                getDateRanges: jest.fn(() => ['2022-05-25', '2022-05-26'])
            };
            const instance = shallow(<Index {...props} />).instance();
            instance.handleToggle = jest.fn();

            // Act
            instance.onChange(date);

            // Assert
            expect(instance.handleToggle).toHaveBeenCalledTimes(1);
            expect(window.isLivePage).toEqual(false);
            expect(props.setSelectedDate).toHaveBeenCalledWith(date);
            expect(props.onChange).toHaveBeenCalledWith(date);
            expect(props.navigate).toHaveBeenCalledWith('lich-thi-dau/bong-da/2022-05-25');
            expect(props.getDateRanges).toHaveBeenCalledWith('2022-05-25');
            expect(props.setDateRanges).toHaveBeenCalledWith(['2022-05-25', '2022-05-26']);
        });

        it('calls correctly functions when dateRanges include date', () => {
            // Arrange
            const date = '2022-05-25';
            const props = {
                ...defaultProps,
                dateRanges: [date]
            };
            const instance = shallow(<Index {...props} />).instance();
            instance.handleToggle = jest.fn();

            // Act
            instance.onChange(date);

            // Assert
            expect(instance.handleToggle).toHaveBeenCalledTimes(1);
            expect(window.isLivePage).toEqual(false);
            expect(props.setSelectedDate).toHaveBeenCalledWith(date);
            expect(props.onChange).toHaveBeenCalledWith(date);
            expect(props.navigate).toHaveBeenCalledWith('lich-thi-dau/bong-da/2022-05-25');
            expect(props.setDateRanges).toHaveBeenCalledTimes(0);
        });
    });

    it('renders correctly', () => {
        // Act
        const container = shallow(<Index {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});