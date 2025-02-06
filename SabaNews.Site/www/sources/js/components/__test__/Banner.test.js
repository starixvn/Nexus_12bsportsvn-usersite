import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Banner from '../Banner';
import { BannerType } from '@jsroot/common/constants';

describe('Banner', () => {
    let defaultProps = {
        banner: null,
        isMobile: false,
        type: ''
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBannerData', () => {
        it('return correctly banner data when type is desktopTop', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {desktopTopUrl: 'url', desktopTopNavigationUrl: 'link', class: 'banner-top'},
                type: BannerType.DesktopTop
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:320, height: 70, class: 'banner-top'});
        });

        it('return correctly banner data when type is DesktopLeft', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {desktopLeftUrl: 'url', desktopLeftNavigationUrl: 'link', class: 'banner-left'},
                type: BannerType.DesktopLeft
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:910, height: 150, class: 'banner-left'});
        });

        it('return correctly banner data when type is DesktopRight', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {desktopRightUrl: 'url', desktopRightNavigationUrl: 'link', class: 'banner-right'},
                type: BannerType.DesktopRight
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:300, height: 600, class: 'banner-right'});
        });

        it('return correctly banner data when type is MobileTop', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileTopUrl: 'url', mobileTopNavigationUrl: 'link', class: 'banner-mobile-top'},
                type: BannerType.MobileTop
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:375, height: 240, class: 'banner-mobile-top'});
        });

        it('return correctly banner data when type is MobileCenter', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileCenterUrl: 'url', mobileCenterNavigationUrl: 'link', class: 'banner-mobile-center'},
                type: BannerType.MobileCenter
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:375, height: 240, class: 'banner-mobile-center'});
        });

        it('return correctly banner data when type is MobileBottom', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomNavigationUrl: 'link'},
                type: BannerType.MobileBottom
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual({src: 'url', link: 'link', width:375, height: 240, class: 'banner-mobile-bottom'});
        });

        it('return correctly banner data when type is others', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomUrl: 'link'},
                type: 'type'
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getBannerData();
            // Assert
            expect(result).toEqual(null);
        });
    });

    describe('renderBanner', () => {
        it('return null when bannerData is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomUrl: 'link'},
                type: 'type'
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            instance.getBannerData = jest.fn().mockReturnValue(null);
            // Act
            const result = instance.renderBanner();
            // Assert
            expect(result).toEqual(null);
        });

        it('render correcty when isMobile = true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomUrl: 'link'},
                type: 'type',
                isMobile: true
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            instance.getBannerData = jest.fn().mockReturnValue({src:'src', link: 'link'});
            // Act
            const result = instance.renderBanner();
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correcty when isMobile = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomUrl: ''},
                type: 'type',
                isMobile: false
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            instance.getBannerData = jest.fn().mockReturnValue({src:'src', link: ''});
            // Act
            const result = instance.renderBanner();
            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renders', () => {
        it('render null when banner is null', () => {
            // Arrange
            const container = shallow(<Banner {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.render();
            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when data isvalid', () => {
            // Arrange
            const props = {
                ...defaultProps,
                banner: {mobileBottomUrl: 'url', mobileBottomUrl: 'link'},
                type: BannerType.MobileBottom
            };
            const container = shallow(<Banner {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.render();
            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});