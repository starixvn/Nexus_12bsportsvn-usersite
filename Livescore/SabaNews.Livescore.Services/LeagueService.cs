namespace SabaNews.Livescore.Services;

using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.League;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Interfaces;

public class LeagueService(IBaseService baseService) : ILeagueService
{
    public async Task<IList<League>> GetMajorLeagueAsync()
    {
        var criteria = new GetMajorLeagueCriteria();
        var leagues = await baseService.GetDataAsync<League>(criteria);
        return leagues.ToList();
    }

    public async Task<IList<TopScorers>> GetTop10ScorersAsync(GetTop10ScorersCriteria top10ScorersCriteria)
    {
        var top = await baseService.GetDataAsync<TopScorers>(top10ScorersCriteria);
        return top.ToList();
    }
    public async Task<IList<Player>> GetPlayerByIdTeamAsync(long teamId)
    {
        var criteria = new GetPlayerByTeamIdCriteria{ TeamId = teamId };
        var players = await baseService.GetDataAsync<Player>(criteria);
        return players.ToList();
    }


    public async Task<IList<TopScorers>> GetAllTopScorersAsync(long leagueId, long seasonId)
    {
        var criteria = new GetAllTopScorersCriteria{ LeagueId = leagueId, SeasonId =seasonId };
        var top = await baseService.GetDataAsync<TopScorers>(criteria);
        return top.ToList();
    }

    public async Task<IList<League>> GetLeagueByIdsAsync(GetLeagueByIdsCriteria criteria)
    {
        var leagues = await baseService.GetDataAsync<League>(criteria);
        return leagues.ToList();
    }

    public async Task<IList<League>> GetLeaguesAsync()
    {
        var leagues = await baseService.GetDataAsync<League>(new GetLeaguesCriteria());
        return leagues.ToList();
    }

    public async Task<IList<League>> GetAllLeaguesAsync()
    {
        var leagues = await baseService.GetDataAsync<League>(new GetAllLeaguesCriteria());
        return leagues.ToList();
    }

    public async Task<CommandResult> UpdateLeaguesExtraAsync(League league)
    {
        var leagueItem = await GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = "[" + league.LeagueId + "]" });
        var leaguesExtra = await GetLeaguesAsync();
        if(league.Priority > GetLeaguePriority(leaguesExtra) - 1)
        {
            league.Priority = GetLeaguePriority(leaguesExtra) - 1;
        }
        var command = new UpdateLeagueExtraCriteria
        {
            LeagueId = league.LeagueId,
            Priority = league.Priority,
            IsMajor = league.IsMajor
        };
        var commandUpdatePriority = new UpdateLeagueExtraPriorityCriteria
        {
            LeagueIdUpdate = league.LeagueId,
            Priority = league.Priority
        };
        if(league.Priority > leagueItem[0].Priority)
        {
            commandUpdatePriority.Priority = leagueItem[0].Priority;
            commandUpdatePriority.IsCheck = true;
            commandUpdatePriority.IsDelete = true;
            commandUpdatePriority.PriorityUpdate = league.Priority;
        }
        else
        {
            commandUpdatePriority.IsCheck = false;
            commandUpdatePriority.PriorityUpdate = 0;
            commandUpdatePriority.IsDelete = false;

        }
        var result = await baseService.ExecuteNonQueryAsync(command);
        _ = await baseService.ExecuteNonQueryAsync(commandUpdatePriority);
        return result;
    }

    public async Task<CommandResult> DeleteLeaguesExtraAsync(long leagueId)
    {
        var leagueDelete = await GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = "[" + leagueId + "]" });
        var command = new DeleteLeagueExtraCriteria
        {
            LeagueId = leagueId
        };
        var result = await baseService.ExecuteNonQueryAsync(command);
        var commandUpdatePriority = new UpdateLeagueExtraPriorityCriteria

        {
            LeagueIdUpdate = leagueDelete[0].LeagueId,
            Priority = leagueDelete[0].Priority,
            IsDelete = true,
            PriorityUpdate = 0,
            IsCheck = false
        };
        _ = await baseService.ExecuteNonQueryAsync(commandUpdatePriority);
        return result;
    }

    public async Task<CommandResult> InsertLeaguesExtraAsync(long leagueId)
    {
        var leagues = await GetLeaguesAsync();
        var command = new InsertLeagueExtraCriteria
        {
            LeagueId = leagueId,
            Priority = GetLeaguePriority(leagues),
            IsMajor = false,
            CreatedDate = DateTimeUtilize.UtcNow().DateTime
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> UpdateLeaguesAsync(UpdateLeagueCriteria updateLeague)
    {
        return await baseService.ExecuteNonQueryAsync(updateLeague);
    }

    public static int GetLeaguePriority(IList<League> leagues)
    {
        var priority = 0;
        foreach(var item in leagues.Where(val => val.Priority > priority))
        {
            priority = item.Priority;
        }
        return priority + 1;
    }

    public async Task<League> GetLeagueByIdAsync(long leagueId)
    {
        var leagues = await baseService.GetDataEntityAsync<League>(new GetLeagueByIdCriteria
        {
            LeagueId = leagueId
        });
        return leagues;
    }

    public async Task<IList<SeasonStandings>> GetLeagueSeasonStanding(GetLeagueSeasonStandingCriteria criteria)
    {
        var result = await baseService.GetDataAsync<SeasonStandings>(criteria);
        return result.ToList();
    }

    public async Task<(League, IList<SeasonStandings>)> GetLeagueAndSeasonStandingAsync(GetLeagueAndSeasonStandingsCriteria criteria)
    {
        var (leagues, standings) = await baseService.FetchMultipleAsync<League, SeasonStandings>(criteria);
        var league = leagues.FirstOrDefault();
        return (league, standings.ToList());
    }

    public async Task<CommandResult> InsertTopScorerAsync(TopScorers topScorers)
    {
        var criteria = new InsertTopScorersCriteria
        {
            PlayerId = topScorers.PlayerId,
            SeasonId = topScorers.SeasonId,
            LeagueId = topScorers.LeagueId,
            TeamId = topScorers.TeamId,
            Goals = topScorers.Goals,
            Assists = topScorers.Assists,
            Top = topScorers.Top
        };

        var criteriaPriority = new UpdatePriorityTopScorersCriteria
        {
            IsCheck = false,
            TopUpdate = -1,
            Top = topScorers.Top,
            RowNum = topScorers.RowNum
        };
        _ = await baseService.ExecuteNonQueryAsync(criteriaPriority);
        return await baseService.ExecuteNonQueryAsync(criteria);
    }

    public async Task<CommandResult> UpdateTopScorerAsync(TopScorers topScorers)
    {
        var playerUpdate = await GetTopScorersByRowNumAsync(topScorers.RowNum, topScorers.LeagueId, topScorers.SeasonId);
        var criteria = new UpdateTopScorersCriteria
        {
            PlayerId = topScorers.PlayerId,
            SeasonId = topScorers.SeasonId,
            LeagueId = topScorers.LeagueId,
            TeamId = topScorers.TeamId,
            Goals = topScorers.Goals,
            Assists = topScorers.Assists,
            Top = topScorers.Top,
            RowNum = topScorers.RowNum
        };
        var criteriaPriority = new UpdatePriorityTopScorersCriteria
        {
            Top = topScorers.Top,
            RowNum = topScorers.RowNum
        };
        if (topScorers.Top > playerUpdate[0].Top)
        {
            criteriaPriority.Top = playerUpdate[0].Top;
            criteriaPriority.IsCheck = true;
            criteriaPriority.TopUpdate = topScorers.Top;
        }
        else
        {
            criteriaPriority.IsCheck = false;
            criteriaPriority.TopUpdate = 0;
        }
        _ = await baseService.ExecuteNonQueryAsync(criteriaPriority);
        return await baseService.ExecuteNonQueryAsync(criteria);
    }

    public async Task<CommandResult> DeleteTopScorerAsync(int rowNum, long leagueId, long seasonId)
    {
        var criteria = new DeleteTopScorersCriteria
        {
            RowNum = rowNum,
            LeagueId = leagueId,
            SeasonId = seasonId
        };

        return await baseService.ExecuteNonQueryAsync(criteria);
    }

    public async Task<IList<TopScorers>> GetTopScorersByRowNumAsync(int rowNum, long leagueId, long seasonId)
    {
        var criteria = new GetTopScorersByRowNumCriteria { RowNum = rowNum , LeagueId = leagueId, SeasonId = seasonId};
        var topScorers = await baseService.GetDataAsync<TopScorers>(criteria);
        return topScorers.ToList();
    }

    public async Task<IList<Season>> GetSeasonByLeagueIdAsync(long leagueId)
    {
        var criteria = new GetSeasonByLeagueIdCriteria { LeagueId  = leagueId };
        var seasons = await baseService.GetDataAsync<Season>(criteria);
        return seasons.ToList();
    }

    public async Task<SeasonStandingUpdate> GetLeagueSeasonStandingDetailAsync(GetLeagueSeasonStandingDetailCriteria criteria)
    {
        return await baseService.GetDataEntityAsync<SeasonStandingUpdate>(criteria);
    }

    public async Task<CommandResult> UpdateStandingAsync(StandingUpdateModel model)
    {
        var cmdUpdate = new UpdateStandingCommand
        {
            SeasonId = model.SeasonId,
            StageId = model.StageId,
            TeamId = model.TeamId,
            GroupName = model.GroupName,
            Total = model.Total,
            Won = model.Won, 
            Draw = model.Draw,
            Loss = model.Loss,
            Goals = model.Goals,
            GoalsAgainst = model.GoalsAgainst,
            GoalDiff = model.GoalDiff,
            Points = model.Points
        };
        var cmdUpdatePosition = new UpdateStandingPositionCommand
        {
            SeasonId = model.SeasonId,
            StageId = model.StageId,
            TeamId = model.TeamId,
            Position = model.Position,
            OldGroupName = model.OldGroupName
        };
        var result =  await baseService.ExecuteNonQueryAsync(cmdUpdate);
        if (result.IsSuccessful && (model.IsUpdatePosition || model.IsUpdateGroupName))
        {
            result = await baseService.ExecuteNonQueryAsync(cmdUpdatePosition);
        }
        return result;
    }

    public async Task<CommandResult> RemoveStandingCustomAsync(long seasonId)
    {
        var cmd = new RemoveCustomStandingCommand { SeasonId = seasonId };

        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<IList<TeamStage>> GetTeamByStage(long leagueId, long seasonId, long stageId)
    {
        var teams = await baseService.GetDataAsync<TeamStage>(new GetAllLeaguesCriteria());
        return teams.ToList();
    }
}