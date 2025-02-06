namespace SabaNews.Models.Auth;

using System.ComponentModel.DataAnnotations;

public class RegisterModel
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string Phone { get; set; }

    public string YearOfBirth { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    [Compare("Password")]
    [Required]
    public string ConfirmPassword { get; set; }

    public int Id { get; set; }
}