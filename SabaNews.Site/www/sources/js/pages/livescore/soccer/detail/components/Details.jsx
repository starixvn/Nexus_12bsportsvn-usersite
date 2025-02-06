import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import MatchSummary from './MatchSummary';
import Lineups from './Lineups';
import Statistics from './Statistics';
import HeadToHead from './HeadToHead';
import queryString from 'query-string';

export class Details extends PureComponent {
    componentDidMount() {
        let defaultTab = '';
        const params = queryString.parse(window.location.search);
        if (params['tab']) {
            defaultTab = params['tab'].toLowerCase();
        }
        const section = document.getElementById(defaultTab);
        if (section) {
            const isMobile = window.innerWidth < 768;
            const generalHeight = document.querySelector('.detail-fixed').offsetHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const tmpHeight = isMobile ? headerHeight + document.querySelector('.block-line-up-title').offsetHeight : 0;
            window.scroll({
                top: section.offsetTop - generalHeight + tmpHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    render() {
        const { isEvent } = this.props;
        return (
            <div className="details">
                <MatchSummary />
                <Statistics />
                <Lineups isEvent={isEvent} />
                {!isEvent && <HeadToHead />}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match } = state;
    return { match };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);