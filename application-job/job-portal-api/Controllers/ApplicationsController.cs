using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using job_portal_api.Data;
using job_portal_api.Models;

namespace job_portal_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Applications
        [Authorize(Roles = "Employer")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplications()
        {
            var employerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("User ID not found"));
            return await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .Where(a => a.Job.EmployerId == employerId)
                .ToListAsync();
        }

        // GET: api/Applications/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("User ID not found"));
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole != "Employer" && application.ApplicantId != userId)
            {
                return Forbid();
            }

            return application;
        }

        // POST: api/Applications
        [Authorize(Roles = "JobSeeker")]
        [HttpPost]
        public async Task<ActionResult<Application>> CreateApplication([FromBody] Application application)
        {
            var job = await _context.Jobs.FindAsync(application.JobId);
            if (job == null || !job.IsActive)
            {
                return BadRequest("Invalid job or job is not active");
            }

            var applicantId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("User ID not found"));
            application.ApplicantId = applicantId;
            application.AppliedDate = DateTime.UtcNow;
            application.Status = "Pending";

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, application);
        }

        // PUT: api/Applications/5/status
        [Authorize(Roles = "Employer")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] string status)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            var employerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("User ID not found"));
            if (application.Job.EmployerId != employerId)
            {
                return Forbid();
            }

            application.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Applications/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
            {
                return NotFound();
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new InvalidOperationException("User ID not found"));
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole != "Employer" && application.ApplicantId != userId)
            {
                return Forbid();
            }

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 