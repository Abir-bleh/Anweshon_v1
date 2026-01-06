namespace Anweshon.Api.Models
{
    public class ClubExecutive
    {
        public int Id { get; set; }

        public int ClubId { get; set; }
        public Club Club { get; set; } = null!;

        // Optional: link to the user (nullable for external executives)
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public string Name { get; set; } = null!;
        public string Position { get; set; } = null!; // President, GS, etc.
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? PhotoUrl { get; set; }
        public int DisplayOrder { get; set; } = 0;
    }
}
