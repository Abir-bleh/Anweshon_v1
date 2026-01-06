using Anweshon.Api.Data;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Anweshon.Api.Hubs;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<NotificationHub> _notificationsHub;

        public EventRegistrationsController(
            ApplicationDbContext context,
            IHubContext<NotificationHub> notificationsHub)
        {
            _context = context;
            _notificationsHub = notificationsHub;
        }

        private string? GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        // POST: api/EventRegistrations
        // Body: { "eventId": 123 }
        [HttpPost]
        public async Task<ActionResult> Register(CreateEventRegistrationDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var ev = await _context.Events
                .Include(e => e.Club)
                .FirstOrDefaultAsync(e => e.Id == dto.EventId);
            if (ev == null || ev.Status != "Published")
                return BadRequest("Event not found or not open.");

            var already = await _context.EventRegistrations
                .AnyAsync(r => r.EventId == dto.EventId && r.UserId == userId);
            if (already) return BadRequest("Already registered.");

            var reg = new EventRegistration
            {
                EventId = dto.EventId,
                UserId = userId
            };

            _context.EventRegistrations.Add(reg);
            await _context.SaveChangesAsync();

            // Send notification to club executives
            var user = await _context.Users.FindAsync(userId);
            var executives = await _context.ClubExecutives
                .Where(e => e.ClubId == ev.ClubId && !string.IsNullOrEmpty(e.UserId))
                .Select(e => e.UserId)
                .Distinct()
                .ToListAsync();

            foreach (var execUserId in executives)
            {
                await _notificationsHub.Clients.Group($"user_{execUserId}")
                    .SendAsync("ReceiveNotification", new
                    {
                        type = "event_registration",
                        title = "New Registration",
                        message = $"{user?.UserName ?? user?.Email ?? "A user"} registered for {ev.Title}",
                        eventId = ev.Id,
                        eventTitle = ev.Title,
                        clubId = ev.ClubId,
                        clubName = ev.Club?.Name,
                        timestamp = DateTime.UtcNow
                    });
            }

            return Ok(new { reg.Id });
        }

        // GET: api/EventRegistrations/my
        // List of all events current user registered for
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<EventRegistrationListItemDto>>> GetMyRegistrations()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var regs = await _context.EventRegistrations
                .Include(r => r.Event)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RegisteredAt)
                .Select(r => new EventRegistrationListItemDto
                {
                    Id = r.Id,
                    EventId = r.EventId,
                    EventTitle = r.Event.Title,
                    StartDateTime = r.Event.StartDateTime,
                    Status = r.Status
                })
                .ToListAsync();

            return Ok(regs);
        }

        // GET: api/EventRegistrations/my/{eventId}
        // Check if current user is registered for a specific event
        [HttpGet("my/{eventId:int}")]
        public async Task<ActionResult<EventRegistrationListItemDto?>> GetMyRegistrationForEvent(int eventId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var reg = await _context.EventRegistrations
                .Include(r => r.Event)
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.UserId == userId);

            if (reg == null)
                return Ok(null);

            var dto = new EventRegistrationListItemDto
            {
                Id = reg.Id,
                EventId = reg.EventId,
                EventTitle = reg.Event.Title,
                StartDateTime = reg.Event.StartDateTime,
                Status = reg.Status
            };

            return Ok(dto);
        }

        // DELETE: api/EventRegistrations/my/{eventId}
        // Cancel current user's registration for given event
        [HttpDelete("my/{eventId:int}")]
        public async Task<ActionResult> CancelMyRegistrationForEvent(int eventId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var reg = await _context.EventRegistrations
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.UserId == userId);

            if (reg == null)
                return NotFound("You are not registered for this event.");

            _context.EventRegistrations.Remove(reg);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
