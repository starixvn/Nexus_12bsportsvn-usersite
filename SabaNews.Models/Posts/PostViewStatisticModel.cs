namespace SabaNews.Models.Posts;

using System.Collections.Generic;
using System.Linq;

public class PostViewStatisticModel
{
    public IEnumerable<PostStatisticInfo> PostViewDetails { get; set; }

    public int TotalPost => PostViewDetails.Sum(i => i.PostCount);

    public int TotalVideo => PostViewDetails.Sum(i => i.VideoCount);

    public int TotalPostView => PostViewDetails.Sum(i => i.PostView);

    public int TotalVideoView => PostViewDetails.Sum(i => i.VideoView);
}