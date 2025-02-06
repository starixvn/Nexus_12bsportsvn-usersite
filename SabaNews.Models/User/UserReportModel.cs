namespace SabaNews.Models.User;

using System;


public class UserReportModel
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string Name { get; set; }

    public string Password { get; set; }

    public string Phone { get; set; }

    public string Gender { get; set; }

    public string Photo { get; set; }

    public bool EmailConfirmed { get; set; }

    public string LoginType { get; set; }

    public string SavedPosts { get; set; }

    public string Metadata { get; set; }

    public string YearOfBirth { get; set;}

    public DateTime RegisterDate { get; set; }

    public string Role => Metadata != null && Metadata.Contains(Core.Constants.Role.Administrator) ? Core.Constants.Role.Administrator : Core.Constants.Role.Customer;

    public int IsSubscribe { get; set; } = 1;

}