import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import FavoriteMatches from '@jsroot/components/FavoriteMatches';
import LastestNews from '@jsroot/components/LastestNews';
import Breadscrum from '@jsroot/components/Breadscrum';
import Grid from './Grid';

export class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getFavLeagues();
    this.props.getLeagues();
    this.props.getLastestNews();
  }

  render() {
    const { posts } = this.props;
    return (
      <div className="container livescore-container">
        <div className="livescore-soccer">
          <div className="livescore-soccer-main">
            <Breadscrum
              currentPage="Giải đấu của tôi"
              currentPageUrl={window.location.href}
            />
            <div className="livescore-league-header-detail">
              <div className="livescore-league-header-detail-group">
                <div className="livescore-league-header-detail-name">
                  Giải đấu của tôi
                </div>
              </div>
            </div>
            <Grid />
          </div>
          <div className="livescore-soccer-extension">
            <FavoriteMatches />
            <LastestNews posts={posts} />
          </div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => {
  const { posts } = state;
  return { posts };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);