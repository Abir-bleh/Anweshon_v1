using Anweshon.Api.Data;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AchievementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string? GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        // GET: api/Achievements/club/{clubId}
        [HttpGet("club/{clubId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AchievementDto>>> GetApprovedAchievements(int clubId)
        {
            var achievements = await _context.Achievements
                .Include(a => a.SubmittedBy)
                .Where(a => a.ClubId == clubId && a.Status == "Approved")
                .OrderByDescending(a => a.AchievementDate)
                .Select(a => new AchievementDto
                {
                    Id = a.Id,
                    ClubId = a.ClubId,
                    Title = a.Title,
                    Description = a.Description,
                    AchievementDate = a.AchievementDate,
                    AchievementType = a.AchievementType,
                    MemberName = a.MemberName,
                    ImageUrl = a.ImageUrl,
                    SubmittedByUserId = a.SubmittedByUserId,
                    SubmittedByName = a.SubmittedBy != null 
                        ? (a.SubmittedBy.FullName ?? a.SubmittedBy.UserName ?? "Unknown")
                        : null,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return Ok(achievements);
        }

        // GET: api/Achievements/club/{clubId}/pending
        [HttpGet("club/{clubId:int}/pending")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AchievementDto>>> GetPendingAchievements(int clubId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Check if user is ClubAdmin or an executive of the club
            var isClubAdmin = User.IsInRole("ClubAdmin");
            
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == clubId && e.UserId == userId);

            if (!isClubAdmin && !isExecutive)
                return Forbid();

            var achievements = await _context.Achievements
                .Include(a => a.SubmittedBy)
                .Where(a => a.ClubId == clubId && a.Status == "Pending")
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AchievementDto
                {
                    Id = a.Id,
                    ClubId = a.ClubId,
                    Title = a.Title,
                    Description = a.Description,
                    AchievementDate = a.AchievementDate,
                    AchievementType = a.AchievementType,
                    MemberName = a.MemberName,
                    ImageUrl = a.ImageUrl,
                    SubmittedByUserId = a.SubmittedByUserId,
                    SubmittedByName = a.SubmittedBy != null 
                        ? (a.SubmittedBy.FullName ?? a.SubmittedBy.UserName ?? "Unknown")
                        : null,
                    Status = a.Status,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return Ok(achievements);
        }

        // POST: api/Achievements
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AchievementDto>> SubmitAchievement(CreateAchievementDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Check if user is ClubAdmin, member, or executive of the club
            var isClubAdmin = User.IsInRole("ClubAdmin");
            
            var isMember = await _context.Memberships
                .AnyAsync(m => m.ClubId == dto.ClubId && m.UserId == userId);
            
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == dto.ClubId && e.UserId == userId);

            if (!isClubAdmin && !isMember && !isExecutive)
                return Forbid();

            // If ClubAdmin or executive, auto-approve. Otherwise, pending
            var status = (isClubAdmin || isExecutive) ? "Approved" : "Pending";

            var achievement = new Achievement
            {
                ClubId = dto.ClubId,
                Title = dto.Title,
                Description = dto.Description,
                AchievementDate = dto.AchievementDate,
                AchievementType = dto.AchievementType,
                MemberName = dto.MemberName,
                ImageUrl = dto.ImageUrl,
                SubmittedByUserId = userId,
                Status = status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Achievements.Add(achievement);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            var result = new AchievementDto
            {
                Id = achievement.Id,
                ClubId = achievement.ClubId,
                Title = achievement.Title,
                Description = achievement.Description,
                AchievementDate = achievement.AchievementDate,
                AchievementType = achievement.AchievementType,
                MemberName = achievement.MemberName,
                ImageUrl = achievement.ImageUrl,
                SubmittedByUserId = achievement.SubmittedByUserId,
                SubmittedByName = user?.FullName ?? user?.UserName ?? "Unknown",
                Status = achievement.Status,
                CreatedAt = achievement.CreatedAt
            };

            return Ok(result);
        }

        // PUT: api/Achievements/{id}/approve
        [HttpPut("{id:int}/approve")]
        [Authorize]
        public async Task<ActionResult> ApproveAchievement(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var achievement = await _context.Achievements
                .FirstOrDefaultAsync(a => a.Id == id);

            if (achievement == null) return NotFound();

            // Check if user is ClubAdmin or an executive of the club
            var isClubAdmin = User.IsInRole("ClubAdmin");
            
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == achievement.ClubId && e.UserId == userId);

            if (!isClubAdmin && !isExecutive)
                return Forbid();

            achievement.Status = "Approved";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Achievements/{id}/reject
        [HttpPut("{id:int}/reject")]
        [Authorize]
        public async Task<ActionResult> RejectAchievement(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var achievement = await _context.Achievements
                .FirstOrDefaultAsync(a => a.Id == id);

            if (achievement == null) return NotFound();

            // Check if user is ClubAdmin or an executive of the club
            var isClubAdmin = User.IsInRole("ClubAdmin");
            
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == achievement.ClubId && e.UserId == userId);

            if (!isClubAdmin && !isExecutive)
                return Forbid();

            achievement.Status = "Rejected";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Achievements/{id}
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> DeleteAchievement(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var achievement = await _context.Achievements
                .FirstOrDefaultAsync(a => a.Id == id);

            if (achievement == null) return NotFound();

            // Only executives can delete
            var isExecutive = await _context.ClubExecutives
                .AnyAsync(e => e.ClubId == achievement.ClubId && e.UserId == userId);

            if (!isExecutive)
                return Forbid();

            _context.Achievements.Remove(achievement);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
