using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using job_portal_api.Data;
using job_portal_api.DTOs;
using System.Security.Claims;

namespace job_portal_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDTO>> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

            if (user == null)
                return NotFound();

            return Ok(new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CompanyName = user.CompanyName,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber
            });
        }

        [HttpPut("profile")]
        public async Task<ActionResult<UserDTO>> UpdateProfile([FromBody] UpdateProfileDTO updateProfile)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

            if (user == null)
                return NotFound();

            user.FullName = updateProfile.FullName;
            user.PhoneNumber = updateProfile.PhoneNumber;
            if (user.Role == "Employer")
            {
                user.CompanyName = updateProfile.CompanyName;
            }

            await _context.SaveChangesAsync();

            return Ok(new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CompanyName = user.CompanyName,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber
            });
        }
    }
} 