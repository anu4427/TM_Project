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
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("jobseeker")]
        public async Task<ActionResult<JobSeekerDashboardDTO>> GetJobSeekerDashboard()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var applications = await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.ApplicantId == int.Parse(userId))
                .OrderByDescending(a => a.AppliedDate)
                .Take(5)
                .ToListAsync();

            var dashboard = new JobSeekerDashboardDTO
            {
                TotalApplications = await _context.Applications.CountAsync(a => a.ApplicantId == int.Parse(userId)),
                PendingApplications = await _context.Applications.CountAsync(a => a.ApplicantId == int.Parse(userId) && a.Status == "Pending"),
                ShortlistedApplications = await _context.Applications.CountAsync(a => a.ApplicantId == int.Parse(userId) && a.Status == "Shortlisted"),
                RejectedApplications = await _context.Applications.CountAsync(a => a.ApplicantId == int.Parse(userId) && a.Status == "Rejected"),
                RecentApplications = applications.Select(a => new ApplicationDTO
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = a.Job.Title,
                    Company = a.Job.Company,
                    AppliedDate = a.AppliedDate,
                    Status = a.Status
                }).ToList()
            };

            return Ok(dashboard);
        }

        [HttpGet("recruiter")]
        public async Task<ActionResult<RecruiterDashboardDTO>> GetRecruiterDashboard()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var recentJobs = await _context.Jobs
                .Where(j => j.EmployerId == int.Parse(userId))
                .OrderByDescending(j => j.PostedDate)
                .Take(5)
                .ToListAsync();

            var recentApplications = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .Where(a => a.Job.EmployerId == int.Parse(userId))
                .OrderByDescending(a => a.AppliedDate)
                .Take(5)
                .ToListAsync();

            var dashboard = new RecruiterDashboardDTO
            {
                TotalJobsPosted = await _context.Jobs.CountAsync(j => j.EmployerId == int.Parse(userId)),
                ActiveJobs = await _context.Jobs.CountAsync(j => j.EmployerId == int.Parse(userId) && j.IsActive),
                TotalApplications = await _context.Applications.CountAsync(a => a.Job.EmployerId == int.Parse(userId)),
                PendingApplications = await _context.Applications.CountAsync(a => a.Job.EmployerId == int.Parse(userId) && a.Status == "Pending"),
                RecentJobs = recentJobs.Select(j => new JobDTO
                {
                    Id = j.Id,
                    Title = j.Title,
                    Company = j.Company,
                    Location = j.Location,
                    PostedDate = j.PostedDate,
                    IsActive = j.IsActive
                }).ToList(),
                RecentApplications = recentApplications.Select(a => new ApplicationDTO
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = a.Job.Title,
                    ApplicantName = a.Applicant.FullName,
                    AppliedDate = a.AppliedDate,
                    Status = a.Status
                }).ToList()
            };

            return Ok(dashboard);
        }
    }
} 