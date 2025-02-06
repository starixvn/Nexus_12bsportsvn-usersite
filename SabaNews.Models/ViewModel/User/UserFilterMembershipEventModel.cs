namespace SabaNews.Models.ViewModel.User;

public class UserFilterMembershipEventModel
{
    public byte Stage { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }

    public string Search { get; set; }

    public string DateSearch { get; set; }

    public string DateSort { get; set; }
}