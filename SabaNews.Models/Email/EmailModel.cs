namespace SabaNews.Models.Email;

using System;

public class EmailModel
{
    public int Id { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public string EmailReturnLink { get; set; }

    public string EmbeddedLink { get; set; }

    public int CreatedBy { get; set; }

    public string CreatedName { get; set; }

    public DateTime SendDate { get; set; }

    public int Status { get; set; } 

    public int TotalSent { get; set; }

    public int TotalCreate { get; set; }

    public int TotalClicked { get; set; }

    public DateTime CreatedDate { get; set; }

    public string Users { get; set; }
}