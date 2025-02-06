namespace SabaNews.Models.Email;

using System;

public class EmailDetailModel
{
    public int EmailId { get; set; }

    public int UserId { get; set; }

    public string Username { get; set; }

    public string TokenId { get; set; }

    public string EmailAddress { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public DateTime SendTime { get; set; }

    public int IsUserClicked { get; set; }

    public int Status { get; set; }

    public string SubscribeToken { get; set; }
}