import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { DateBar } from '../DateBar';
import Site from '@jsroot/common/site';
import LangHelper from '@jsroot/common/langHelper';

describe('DateBar', () => {
    const defaultProps = {
        isMobile: false,
        totalMatches: 0,
        onClick: jest.fn(),
        navigate: jest.fn(),
        getDateRanges: jest.fn()
    };

    beforeAll(() => {
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta); 
        Site.resolveClientUrl = jest.fn(url => url);
        LangHelper.getResource = jest.fn(key => key);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        window.isLivePage = false;
    });

    it('renders correctly when window.isLivePage = false', () => {
        // Act
        const container = shallow(<DateBar {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when window.isLivePage = true', () => {
        // Assert
        window.isLivePage = true;

        // Act
        const container = shallow(<DateBar {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when isMobile = true', () => {
        // Assert
        const props = { ...defaultProps, isMobile: true };

        // Act
        const container = shallow(<DateBar {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when totalMatches > 0 and totalMatches < 99', () => {
        // Assert
        const props = { ...defaultProps, totalMatches: 98 };

        // Act
        const container = shallow(<DateBar {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when totalMatches = 99', () => {
        // Assert
        const props = { ...defaultProps, totalMatches: 99 };

        // Act
        const container = shallow(<DateBar {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when totalMatches > 99', () => {
        // Assert
        const props = { ...defaultProps, totalMatches: 100 };

        // Act
        const container = shallow(<DateBar {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('calls correctly functions when click on live button', () => {
        // Arrange
        const container = shallow(<DateBar {...defaultProps} />);

        // Act
        container.find('div.btn-live').simulate('click');

        // Assert
        expect(window.isLivePage).toEqual(true);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
        expect(defaultProps.navigate).toHaveBeenCalledWith('lich-thi-dau/bong-da/truc-tiep');
    });
});