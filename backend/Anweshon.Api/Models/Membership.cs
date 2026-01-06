namespace Anweshon.Api.Models
{
    public class Membership
    {
        public int Id { get; set; }

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;

        public string? RoleInClub { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
