// Dtos/MembershipDto.cs
namespace Anweshon.Api.Dtos
{
    public class MembershipDto
    {
        public int ClubId { get; set; }
        public string UserId { get; set; } = default!;
        public string? RoleInClub { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class ClubMemberDto
    {
        public int MembershipId { get; set; }
        public string UserId { get; set; } = null!;
        public string? FullName { get; set; }
        public string Email { get; set; } = null!;
        public string? RoleInClub { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
