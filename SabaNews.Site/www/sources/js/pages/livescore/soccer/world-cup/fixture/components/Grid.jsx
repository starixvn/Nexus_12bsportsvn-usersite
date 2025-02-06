import React, { PureComponent } from 'react';
import Match from './Match';
import { MatchStatus } from '@jsroot/common/constants';
import { SwiperSlide, Swiper } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);
export default class Grid extends PureComponent {
    constructor(props) {
        super(props);
        this.elementRef = React.createRef();
        this.slide = null;
    }

    initSlide = () => {
        const { matches, isFinished, isMobile } = this.props;
        let start = 0;
        const showItems = Math.ceil(window.innerWidth / 200) - 1;
        if (!isFinished) {
            const postIndex = isMobile ? 0 : 3;
            const postMatchIndex = [...matches].reverse().findIndex(item => item.status === MatchStatus.Finished);
            const startLastPage = matches.length - this.showItems + 1;
            if (postMatchIndex >= 0) {
                const lastIndex = matches.length - postMatchIndex;
                if (lastIndex - postIndex > startLastPage) {
                    start = startLastPage;
                } else {
                    start = lastIndex - postIndex > 0 ? lastIndex - postIndex : 0;
                }
            }
        }
        const slide = { start, showItems };
        this.slide = slide;
        return slide;
    };

    componentDidMount() {
        const { isMobile } = this.props;
        if(isMobile) {
            const scrollWidth = this.slide.start * 240;
            this.elementRef.current && this.elementRef.current.scrollTo({
                left: scrollWidth,
                behavior: 'smooth'
            });
        }
    }


    render() {
        const { league, matches, isMobile } = this.props;
        const slide = this.initSlide();
        return (
            <div className="wc-bg-overflow">
                <div className="wc-date-bar" ref={this.elementRef}>
                    {
                        !isMobile &&
                        <Swiper
                            initialSlide={slide.start}
                            spaceBetween={10}
                            slidesPerView={slide.showItems}
                            watchOverflow={true}
                            navigation={{
                                prevEl: '.wc-date-control-prev',
                                nextEl: '.wc-date-control-next'
                            }}
                        >
                            {
                                matches.map((item, index) =>
                                    <SwiperSlide key={index} className="scroll-snap-items">
                                        <Match key={index} match={{ ...item, league }} />
                                    </SwiperSlide>
                                )
                            }
                            <div className="wc-date-control wc-date-control-next"><i className="icon-chevron-right"></i></div>
                            <div className="wc-date-control wc-date-control-prev"><i className="icon-chevron-left"></i></div>
                        </Swiper>
                    }
                    {
                        isMobile &&
                        matches.map((item, index) =>
                            <Match key={index} match={{ ...item, league }} />
                        )
                    }
                </div>
            </div>
        );
    }
}