import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import Summary from './Summary';
import Lineups from './Lineups';
import FunctionBar from './FunctionBar';
import Statistics from './Statistics';
import queryString from 'query-string';

export class Detail extends PureComponent {
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
        return (
            <div className="details">
                <FunctionBar />
                <Summary />
                <Statistics />
                <Lineups />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
    const { match } = state;
    return { match };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);