using Anweshon.Api.Data;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClubMessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/ClubMessages
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                        ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var message = new ClubMessage
            {
                ClubId = dto.ClubId,
                UserId = userId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.ClubMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { id = message.Id, message = "Message sent" });
        }

        // GET: api/ClubMessages/club/{clubId}
        [HttpGet("club/{clubId}")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> GetClubMessages(int clubId)
        {
            var messages = await _context.ClubMessages
                .Include(m => m.User)
                .Where(m => m.ClubId == clubId)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Message,
                    m.CreatedAt,
                    m.IsReadByAdmin,
                    m.AdminResponse,
                    m.RespondedAt,
                    User = new
                    {
                        m.User.FullName,
                        m.User.Email,
                        m.User.StudentId
                    }
                })
                .ToListAsync();

            return Ok(messages);
        }

        // GET: api/ClubMessages/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult> GetMyMessages()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                        ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var messages = await _context.ClubMessages
                .Include(m => m.Club)
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.ClubId,
                    ClubName = m.Club.Name,
                    m.Message,
                    m.CreatedAt,
                    m.AdminResponse,
                    m.RespondedAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        // PUT: api/ClubMessages/{id}/respond
        [HttpPut("{id}/respond")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> RespondToMessage(int id, [FromBody] RespondMessageDto dto)
        {
            var message = await _context.ClubMessages.FindAsync(id);
            if (message == null)
                return NotFound();

            message.AdminResponse = dto.Response;
            message.RespondedAt = DateTime.UtcNow;
            message.IsReadByAdmin = true;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Response sent" });
        }

        // PUT: api/ClubMessages/{id}/mark-read
        [HttpPut("{id}/mark-read")]
        [Authorize(Roles = "ClubAdmin")]
        public async Task<ActionResult> MarkAsRead(int id)
        {
            var message = await _context.ClubMessages.FindAsync(id);
            if (message == null)
                return NotFound();

            message.IsReadByAdmin = true;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

    public class SendMessageDto
    {
        public int ClubId { get; set; }
        public string Message { get; set; } = default!;
    }

    public class RespondMessageDto
    {
        public string Response { get; set; } = default!;
    }
}