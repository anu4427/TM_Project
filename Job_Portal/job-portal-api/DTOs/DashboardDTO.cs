namespace job_portal_api.DTOs
{
    public class JobSeekerDashboardDTO
    {
        public int TotalApplications { get; set; }
        public int PendingApplications { get; set; }
        public int ShortlistedApplications { get; set; }
        public int RejectedApplications { get; set; }
        public List<ApplicationDTO> RecentApplications { get; set; } = new();
    }

    public class RecruiterDashboardDTO
    {
        public int TotalJobsPosted { get; set; }
        public int ActiveJobs { get; set; }
        public int TotalApplications { get; set; }
        public int PendingApplications { get; set; }
        public List<JobDTO> RecentJobs { get; set; } = new();
        public List<ApplicationDTO> RecentApplications { get; set; } = new();
    }
} 