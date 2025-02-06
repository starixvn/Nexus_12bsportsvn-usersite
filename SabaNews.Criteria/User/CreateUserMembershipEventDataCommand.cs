namespace SabaNews.Criteria.User;

using System;

public class CreateUserMembershipEventDataCommand : BaseNonQueryCommand
{
    public int UserId { get; set; }

    public string LuckyNumber { get; set; }

    public DateTimeOffset JoinDate { get; set; }

    public override string GetSettingKey() => "user_membership_event_create_data";

    public override bool IsValid() => UserId > 0;


}