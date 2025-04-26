export interface EmployeeRegister {
  username: string;
  password: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  hometown: string;
  interests: string[];
  experience: number;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  languagesKnown: string[];
  currentLocation: string;
  lastJobExperience: string;
  lastDesignation: string;
  department: 'it' | 'services' | 'others';
  reasonForLeaving: string;
}

export interface EmployerRegister {
  companyName: string;
  password: string;
  email: string;
  industry: string;
  experience: number;
  about: string;
}

export type RegisterTab = 'employee' | 'employer'; 