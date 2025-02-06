const path = require('path');

const projectRoot = path.resolve(__dirname, '../../../');

const cssPaths = {
    build: 'wwwroot/css',

    livescore_soccer_index: ['./www/sources/css/pages/livescore/soccer/index.scss'],
    livescore_soccer_league_detail: ['./www/sources/css/pages/livescore/soccer/league-detail.scss'],
    livescore_soccer_detail: ['./www/sources/css/pages/livescore/soccer/detail.scss'],
    livescore_soccer_favourite_match: ['./www/sources/css/pages/livescore/soccer/favourite-match.scss'],
    livescore_soccer_favourite_league: ['./www/sources/css/pages/livescore/soccer/favourite-league.scss'],
    livescore_soccer_worldcup_fixture: ['./www/sources/css/pages/livescore/soccer/world-cup/fixture.scss'],
    livescore_soccer_worldcup_full_fixture: ['./www/sources/css/pages/livescore/soccer/world-cup/full-fixture.scss'],
    livescore_soccer_worldcup_standing_playoff: ['./www/sources/css/pages/livescore/soccer/world-cup/standing-playoff.scss'],
    livescore_soccer_worldcup_minigame_stage: ['./www/sources/css/pages/livescore/soccer/world-cup/minigame-stage.scss'],
    livescore_soccer_worldcup_minigame: ['./www/sources/css/pages/livescore/soccer/world-cup/minigame-standing.scss'],
    livescore_soccer_worldcup_minigame_detail_stage: ['./www/sources/css/pages/livescore/soccer/world-cup/minigame-detail-stage.scss'],
    livescore_soccer_worldcup_minigame_detail: ['./www/sources/css/pages/livescore/soccer/world-cup/minigame-detail.scss'],
    livescore_soccer_worldcup_minigame_winner: ['./www/sources/css/pages/livescore/soccer/world-cup/minigame-winners.scss'],
    livescore_soccer_homepage_fixture: ['./www/sources/css/pages/livescore/soccer/sidebar/fixture.scss'],
    livescore_soccer_homepage_standing: ['./www/sources/css/pages/livescore/soccer/sidebar/standing.scss'],
    livescore_soccer_category_standing: ['./www/sources/css/pages/livescore/soccer/sidebar/category-standing.scss'],
    livescore_soccer_category_fixture: ['./www/sources/css/pages/livescore/soccer/sidebar/category-fixture.scss'],
    livescore_soccer_match_detail_shortcut: ['./www/sources/css/pages/livescore/soccer/match-detail-shortcut.scss'],
    livescore_soccer_post_detail_fixture: ['./www/sources/css/pages/livescore/soccer/sidebar/post-detail.scss'],
    livescore_soccer_euro2024_fixture: ['./www/sources/css/pages/livescore/soccer/euro-2024/fixture.scss'],
    livescore_soccer_euro2024_match_detail: ['./www/sources/css/pages/livescore/soccer/euro-2024/match-detail.scss'],
    livescore_soccer_euro2024_standing: ['./www/sources/css/pages/livescore/soccer/euro-2024/standing.scss'],
    livescore_soccer_euro2024_full_fixture: ['./www/sources/css/pages/livescore/soccer/euro-2024/full-fixture.scss'],
    livescore_soccer_euro2024_team_detail: ['./www/sources/css/pages/livescore/soccer/euro-2024/team-detail.scss'],
    livescore_soccer_euro2024_minigame_standing: ['./www/sources/css/pages/livescore/soccer/euro-2024/minigame-standing.scss'],
    livescore_soccer_euro2024_minigame_winner: ['./www/sources/css/pages/livescore/soccer/euro-2024/minigame-winner.scss'],
    livescore_soccer_euro2024_minigame_stage: ['./www/sources/css/pages/livescore/soccer/euro-2024/minigame-stage.scss'],
    livescore_soccer_euro2024_minigame_profile: ['./www/sources/css/pages/livescore/soccer/euro-2024/minigame-profile.scss'],
    livescore_soccer_euro2024_minigame_profile_stage: ['./www/sources/css/pages/livescore/soccer/euro-2024/minigame-profile-stage.scss']
};

const scriptPaths = {
    build: 'wwwroot/js',

    language: ['./www/sources/js/common/languages/ViewResources_vi_VN.js'],
    livescore_soccer_index: ['./www/sources/js/pages/livescore/soccer/index/index.jsx'],
    livescore_soccer_league_detail: ['./www/sources/js/pages/livescore/soccer/league-detail/index.jsx'],
    livescore_soccer_detail: ['./www/sources/js/pages/livescore/soccer/detail/index.jsx'],
    livescore_soccer_favourite_match: ['./www/sources/js/pages/livescore/soccer/favourite-match/index.jsx'],
    livescore_soccer_favourite_league: ['./www/sources/js/pages/livescore/soccer/favourite-league/index.jsx'],
    livescore_soccer_worldcup_fixture: ['./www/sources/js/pages/livescore/soccer/world-cup/fixture/index.jsx'],
    livescore_soccer_worldcup_full_fixture: ['./www/sources/js/pages/livescore/soccer/world-cup/full-fixture/index.jsx'],
    livescore_soccer_worldcup_standing_playoff: ['./www/sources/js/pages/livescore/soccer/world-cup/standing-playoff/index.jsx'],
    livescore_soccer_worldcup_minigame_stage: ['./www/sources/js/pages/livescore/soccer/world-cup/minigame-stage/index.jsx'],
    livescore_soccer_worldcup_minigame: ['./www/sources/js/pages/livescore/soccer/world-cup/minigame-standing/index.jsx'],
    livescore_soccer_worldcup_minigame_detail_stage: ['./www/sources/js/pages/livescore/soccer/world-cup/minigame-detail-stage/index.jsx'],
    livescore_soccer_worldcup_minigame_detail: ['./www/sources/js/pages/livescore/soccer/world-cup/minigame-detail/index.jsx'],
    livescore_soccer_worldcup_minigame_winner: ['./www/sources/js/pages/livescore/soccer/world-cup/minigame-winners/index.jsx'],
    livescore_soccer_homepage_fixture: ['./www/sources/js/pages/livescore/soccer/sidebar/fixture/index.jsx'],
    livescore_soccer_homepage_standing: ['./www/sources/js/pages/livescore/soccer/sidebar/standing/index.jsx'],
    livescore_soccer_category_standing: ['./www/sources/js/pages/livescore/soccer/sidebar/category-standing/index.jsx'],
    livescore_soccer_category_fixture: ['./www/sources/js/pages/livescore/soccer/sidebar/category-fixture/index.jsx'],
    livescore_soccer_match_detail_shortcut: ['./www/sources/js/pages/livescore/soccer/match-detail-shortcut/index.jsx'],
    livescore_soccer_post_detail_fixture: ['./www/sources/js/pages/livescore/soccer/sidebar/post-detail/index.jsx'],
    livescore_soccer_euro2024_fixture: ['./www/sources/js/pages/livescore/soccer/euro-2024/fixture/index.jsx'],
    livescore_soccer_euro2024_match_detail: ['./www/sources/js/pages/livescore/soccer/euro-2024/match-detail/index.jsx'],
    livescore_soccer_euro2024_standing: ['./www/sources/js/pages/livescore/soccer/euro-2024/standing/index.jsx'],
    livescore_soccer_euro2024_full_fixture: ['./www/sources/js/pages/livescore/soccer/euro-2024/full-fixture/index.jsx'],
    livescore_soccer_euro2024_team_detail: ['./www/sources/js/pages/livescore/soccer/euro-2024/team-detail/index.jsx'],
    livescore_soccer_euro2024_minigame_standing: ['./www/sources/js/pages/livescore/soccer/euro-2024/minigame-standing/index.jsx'],
    livescore_soccer_euro2024_minigame_winner: ['./www/sources/js/pages/livescore/soccer/euro-2024/minigame-winner/index.jsx'],
    livescore_soccer_euro2024_minigame_stage: ['./www/sources/js/pages/livescore/soccer/euro-2024/minigame-stage/index.jsx'],
    livescore_soccer_euro2024_minigame_profile: ['./www/sources/js/pages/livescore/soccer/euro-2024/minigame-profile/index.jsx'],
    livescore_soccer_euro2024_minigame_profile_stage: ['./www/sources/js/pages/livescore/soccer/euro-2024/minigame-profile-stage/index.jsx'],
};

module.exports = {
    projectRoot: projectRoot,
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};