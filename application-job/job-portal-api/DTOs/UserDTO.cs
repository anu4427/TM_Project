namespace job_portal_api.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string CompanyName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class UpdateProfileDTO
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyName { get; set; }
    }
} 