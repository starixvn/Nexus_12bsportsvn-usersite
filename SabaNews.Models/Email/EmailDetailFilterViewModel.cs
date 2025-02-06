namespace SabaNews.Models.Email;

public class EmailDetailFilterViewModel
{
    public int Page { get; set; }

    public int PageSize { get; set; }

    public int EmailId { get; set; }

    public string Search { get; set; }

    public int FilterClicked { get; set; }

    public int Status { get; set; }
}