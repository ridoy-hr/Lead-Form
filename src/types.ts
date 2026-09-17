export interface FormFieldItem {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'typeahead' | 'singleSelect' | 'multiSelect' | 'number' | 'checkbox' | 'date';
  display: boolean;
  required?: boolean;
  category?: 'Standard' | 'Custom' | 'Virtual Event';
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName?: string;
  respondentName: string;
  respondentEmail: string;
  submittedAt: string;
  approvalStatus: 'Approved' | 'Denied' | 'Pending' | 'No Approval Required';
  answers: Record<string, string>;
}

export interface EmailConfig {
  id: string;
  type: 'Confirmation Email' | 'Approval Email' | 'Deny Email';
  senderEmail: string;
  subjectLine: string;
  emailBody: string;
  emailTrigger: 'Submit Form' | 'Approved' | 'Denied';
}

export interface FormItem {
  id: string;
  name: string;
  description: string;
  buttonText: string;
  calendarLink: string;
  thankYouMessage: string;
  submissionsCount: number;
  clicksCount: number;
  conversionsCount: number;
  peopleScore: number;
  author: string;
  createdAt: string;
  formType: 'Lead Form' | 'Speaker Form' | 'Vendor Sales Lead' | 'Download Form' | 'Awards Nomination' | 'Sign Up Form' | 'Custom Form';
  useTemplate?: string;
  category: string;
  forceDisplay: boolean;
  notifyEmails: string;
  
  // Group & Membership Module
  userGroups: string[];
  memberships: string[];

  // Deal Settings Module
  dealCategory: string;

  // Partner / Reseller & Tracking
  partnerResellerForm: boolean;
  dealParentCat: string;
  prDealCategory: string;
  feathrTracking: boolean;
  linkedInTracking: boolean;

  // Email Settings Module
  senderEmail: string;
  emailSubject: string;
  emailBody: string;

  // Asset & Downloads Module
  assetUrl?: string;
  downloadableLink?: string;

  // Logo / Image Module
  logoUrl?: string;

  fields: FormFieldItem[];
}

export interface FilterOptions {
  search: string;
  formType: string;
  category: string;
  page: number;
  pageSize: number;
}
