import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Job } from '../interfaces/job.interface';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;
  private mockJobs: Job[] = [
    {
      id: '1',  
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      description: 'Looking for an experienced software engineer to join our growing team. You will be responsible for developing and maintaining our core products, working with modern technologies, and mentoring junior developers.',
      requirements: [
        '5+ years of experience in software development',
        'Strong proficiency in JavaScript/TypeScript',
        'Experience with Angular or React',
        'Knowledge of cloud platforms (AWS/Azure)',
        'Excellent problem-solving skills',
        'Strong communication abilities'
      ],
      salary: '25-30 LPA',
      postedDate: new Date('2024-01-01'),
      deadline: new Date('2024-03-01'),
      companyId: 1
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Web Solutions',
      location: 'Mumbai, Maharashtra',
      type: 'Contract',
      description: 'Seeking a skilled frontend developer to work on our client-facing applications. This is a 6-month contract position with the possibility of extension.',
      requirements: [
        '3+ years of frontend development experience',
        'Proficiency in Angular and TypeScript',
        'Experience with responsive design',
        'Knowledge of UI/UX principles',
        'Git version control',
        'Ability to work independently'
      ],
      salary: '15-20 LPA',
      postedDate: new Date('2024-01-15'),
      deadline: new Date('2024-02-15'),
      companyId: 2
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      company: 'Cloud Systems Inc.',
      location: 'Hyderabad, Telangana',
      type: 'Full-time',
      description: 'Join our DevOps team to help build and maintain our cloud infrastructure. You will work on CI/CD pipelines, automation, and infrastructure as code.',
      requirements: [
        '4+ years of DevOps experience',
        'Expertise in AWS or Azure',
        'Experience with Docker and Kubernetes',
        'Knowledge of CI/CD tools (Jenkins, GitHub Actions)',
        'Infrastructure as Code (Terraform, CloudFormation)',
        'Scripting skills (Python, Bash)'
      ],
      salary: '20-25 LPA',
      postedDate: new Date('2024-01-20'),
      deadline: new Date('2024-03-20'),
      companyId: 3
    },
    {
      id: '4',
      title: 'UI/UX Designer',
      company: 'Creative Digital Agency',
      location: 'Delhi, NCR',
      type: 'Full-time',
      description: 'We are looking for a talented UI/UX designer to create beautiful and intuitive user interfaces for our clients. You will work closely with developers and product managers.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma, Adobe XD, or Sketch',
        'Strong portfolio demonstrating web and mobile designs',
        'Understanding of user-centered design principles',
        'Experience with design systems',
        'Ability to conduct user research'
      ],
      salary: '12-18 LPA',
      postedDate: new Date('2024-01-25'),
      deadline: new Date('2024-03-25'),
      companyId: 4
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'Analytics Solutions',
      location: 'Pune, Maharashtra',
      type: 'Full-time',
      description: 'Join our data science team to work on cutting-edge machine learning projects. You will analyze large datasets and build predictive models.',
      requirements: [
        'Master\'s or PhD in Computer Science, Statistics, or related field',
        '3+ years of experience in data science',
        'Proficiency in Python, R, or MATLAB',
        'Experience with machine learning frameworks',
        'Strong statistical analysis skills',
        'Experience with big data technologies'
      ],
      salary: '22-28 LPA',
      postedDate: new Date('2024-02-01'),
      deadline: new Date('2024-04-01'),
      companyId: 5
    },
    {
      id: '6',
      title: 'Product Manager',
      company: 'Innovation Tech',
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      description: 'We are seeking a product manager to lead our product development initiatives. You will work with cross-functional teams to deliver high-quality products.',
      requirements: [
        '5+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Experience with agile methodologies',
        'Excellent communication and leadership abilities',
        'Technical background is a plus',
        'Experience with product analytics tools'
      ],
      salary: '25-35 LPA',
      postedDate: new Date('2024-02-05'),
      deadline: new Date('2024-04-05'),
      companyId: 6
    },
    {
      id: '7',
      title: 'Mobile App Developer',
      company: 'Mobile Solutions',
      location: 'Kolkata, West Bengal',
      type: 'Contract',
      description: 'Looking for an experienced mobile app developer to work on our iOS and Android applications. This is a 12-month contract position.',
      requirements: [
        '4+ years of mobile app development',
        'Experience with React Native or Flutter',
        'Knowledge of iOS and Android platforms',
        'Experience with RESTful APIs',
        'Understanding of mobile UI/UX principles',
        'Git version control'
      ],
      salary: '18-24 LPA',
      postedDate: new Date('2024-02-10'),
      deadline: new Date('2024-04-10'),
      companyId: 7
    },
    {
      id: '8',
      title: 'QA Engineer',
      company: 'Quality Assurance Co.',
      location: 'Ahmedabad, Gujarat',
      type: 'Full-time',
      description: 'Join our QA team to ensure the quality of our software products. You will develop test plans, write automated tests, and perform manual testing.',
      requirements: [
        '3+ years of QA experience',
        'Experience with test automation tools',
        'Knowledge of testing methodologies',
        'Experience with bug tracking systems',
        'Understanding of CI/CD pipelines',
        'Strong attention to detail'
      ],
      salary: '12-16 LPA',
      postedDate: new Date('2024-02-15'),
      deadline: new Date('2024-04-15'),
      companyId: 8
    },
    {
      id: '9',
      title: 'Backend Developer',
      company: 'Server Solutions',
      location: 'Kochi, Kerala',
      type: 'Full-time',
      description: 'We are looking for a backend developer to build scalable and efficient server-side applications. You will work with Node.js, Python, or Java.',
      requirements: [
        '4+ years of backend development',
        'Experience with Node.js or Python',
        'Knowledge of databases (SQL, NoSQL)',
        'Experience with RESTful APIs',
        'Understanding of microservices architecture',
        'Experience with cloud platforms'
      ],
      salary: '18-25 LPA',
      postedDate: new Date('2024-02-20'),
      deadline: new Date('2024-04-20'),
      companyId: 9
    },
    {
      id: '10',
      title: 'Technical Lead',
      company: 'Enterprise Solutions',
      location: 'Gurgaon, Haryana',
      type: 'Full-time',
      description: 'Join our team as a technical lead to guide development efforts and mentor junior developers. You will be responsible for technical decisions and architecture.',
      requirements: [
        '7+ years of software development experience',
        '3+ years of team leadership',
        'Strong architectural skills',
        'Experience with multiple programming languages',
        'Excellent communication and mentoring abilities',
        'Experience with agile methodologies'
      ],
      salary: '35-45 LPA',
      postedDate: new Date('2024-02-25'),
      deadline: new Date('2024-04-25'),
      companyId: 10
    }
  ];

  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJobById(id: string): Observable<Job | undefined> {
    const job = this.mockJobs.find(j => j.id === id);
    return of(job);
  }

  applyForJob(jobId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${jobId}/apply`, {});
  }

  createJob(job: Omit<Job, 'id' | 'postedDate'>): Observable<Job> {
    const newJob: Job = {
      ...job,
      id: (this.mockJobs.length + 1).toString(),
      postedDate: new Date()
    };
    this.mockJobs.push(newJob);
    return of(newJob);
  }

  updateJob(id: string, job: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getJobs(): Observable<Job[]> {
    return of(this.mockJobs).pipe(delay(1000));
  }

  getJobsByCompany(companyId: number): Observable<Job[]> {
    const companyJobs = this.mockJobs.filter(job => job.companyId === companyId);
    return of(companyJobs).pipe(delay(1000));
  }
} 