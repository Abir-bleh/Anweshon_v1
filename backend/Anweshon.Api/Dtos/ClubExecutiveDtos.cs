namespace Anweshon.Api.Dtos
{
    public class ClubExecutiveDto
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string Name { get; set; } = null!;
        public string Position { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? PhotoUrl { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class UpsertClubExecutivesDto
    {
        public List<ClubExecutiveDto> Executives { get; set; } = new();
    }
}
