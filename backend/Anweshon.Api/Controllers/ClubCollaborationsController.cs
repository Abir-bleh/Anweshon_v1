using Anweshon.Api.Data;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClubCollaborationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClubCollaborationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/ClubCollaborations
        [HttpPost]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> SendCollaborationRequest([FromBody] SendCollaborationDto dto)
        {
            var collaboration = new ClubCollaboration
            {
                FromClubId = dto.FromClubId,
                ToClubId = dto.ToClubId,
                Message = dto.Message,
                EventName = dto.EventName,
                EventDate = dto.EventDate,
                EventDetails = dto.EventDetails,
                Status = "Pending"
            };

            _context.ClubCollaborations.Add(collaboration);
            await _context.SaveChangesAsync();

            return Ok(new { id = collaboration.Id, message = "Collaboration request sent" });
        }

        // GET: api/ClubCollaborations/club/{clubId}/received
        [HttpGet("club/{clubId}/received")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> GetReceivedRequests(int clubId)
        {
            var requests = await _context.ClubCollaborations
                .Include(c => c.FromClub)
                .Where(c => c.ToClubId == clubId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.FromClubId,
                    FromClubName = c.FromClub.Name,
                    c.Message,
                    c.EventName,
                    c.EventDate,
                    c.EventDetails,
                    c.Status,
                    c.CreatedAt,
                    c.Response
                })
                .ToListAsync();

            return Ok(requests);
        }

        // GET: api/ClubCollaborations/club/{clubId}/sent
        [HttpGet("club/{clubId}/sent")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> GetSentRequests(int clubId)
        {
            var requests = await _context.ClubCollaborations
                .Include(c => c.ToClub)
                .Where(c => c.FromClubId == clubId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.ToClubId,
                    ToClubName = c.ToClub.Name,
                    c.Message,
                    c.EventName,
                    c.EventDate,
                    c.EventDetails,
                    c.Status,
                    c.CreatedAt,
                    c.Response
                })
                .ToListAsync();

            return Ok(requests);
        }

        // PUT: api/ClubCollaborations/{id}/respond
        [HttpPut("{id}/respond")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> RespondToRequest(int id, [FromBody] RespondCollaborationDto dto)
        {
            var collaboration = await _context.ClubCollaborations.FindAsync(id);
            if (collaboration == null)
                return NotFound();

            collaboration.Status = dto.Status; // "Accepted" or "Rejected"
            collaboration.Response = dto.Response;
            collaboration.RespondedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Response sent" });
        }
    }

    public class SendCollaborationDto
    {
        public int FromClubId { get; set; }
        public int ToClubId { get; set; }
        public string Message { get; set; } = default!;
        public string? EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string? EventDetails { get; set; }
    }

    public class RespondCollaborationDto
    {
        public string Status { get; set; } = default!; // Accepted or Rejected
        public string? Response { get; set; }
    }
}