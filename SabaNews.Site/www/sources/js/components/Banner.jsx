import React, { PureComponent } from 'react';
import { BannerType } from '@jsroot/common/constants';
export default class Banner extends PureComponent {
    constructor(props) {
        super(props);

    }

    getBannerData() {
        const { banner, type } = this.props;
        const bannerData = null;
        switch (type) {
            case BannerType.DesktopTop:
                return { src: banner.desktopTopUrl, link: banner.desktopTopNavigationUrl, width: 320, height: 70, class: 'banner-top' };
            case BannerType.DesktopLeft:
                return { src: banner.desktopLeftUrl, link: banner.desktopLeftNavigationUrl, width: 910, height: 150, class: 'banner-left' };
            case BannerType.DesktopRight:
                return { src: banner.desktopRightUrl, link: banner.desktopRightNavigationUrl, width: 300, height: 600, class: 'banner-right' };
            case BannerType.MobileTop:
                return { src: banner.mobileTopUrl, link: banner.mobileTopNavigationUrl, width: 375, height: 240, class: 'banner-mobile-top' };
            case BannerType.MobileCenter:
                return { src: banner.mobileCenterUrl, link: banner.mobileCenterNavigationUrl, width: 375, height: 240, class: 'banner-mobile-center' };
            case BannerType.MobileBottom:
                return { src: banner.mobileBottomUrl, link: banner.mobileBottomNavigationUrl, width: 375, height: 240, class: 'banner-mobile-bottom' };
            default: return bannerData;
        }
    };

    renderBanner = () => {
        const bannerData = this.getBannerData();
        const { isMobile } = this.props;
        if (bannerData === null || bannerData.src === '') {
            return null;
        };
        const link = bannerData.link === '' ? 'javascripts' : bannerData.link;
        const classDevice = isMobile ? 'show-mobile' : 'show-pc';
        return (
            <div className={`ads-insite ${bannerData.class} ${classDevice}`}>
                <a href={link}>
                    <img src={bannerData.src} className='img-res' alt='banner-livescore' width={bannerData.width} height={bannerData.height} loading='lazy' />
                </a>
            </div>
        )
    }

    render() {
        const { banner } = this.props;
        if (banner === null) {
            return null;
        }
        return (
            <>
                {this.renderBanner()}
            </>
        )
    }

}