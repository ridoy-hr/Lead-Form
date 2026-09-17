import { FormFieldItem, FormItem, FormSubmission, EmailConfig } from '../types';

export const INITIAL_FIELDS: FormFieldItem[] = [
  { id: 'work_email', name: 'Email', type: 'typeahead', display: true, category: 'Standard' },
  { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' },
  { id: 'last_name', name: 'Last Name', type: 'text', display: true, category: 'Standard' }
];

export const MOCK_USER_GROUPS = [
  { id: '1614234938174', name: 'Brand and Communications Community' },
  { id: '1614234926907', name: 'Masters - Leadership' }
];

export const MOCK_MEMBERSHIPS = [
  { id: '1168083607759', name: 'HR SILVER Membership' },
  { id: '1175693258470', name: 'Buyer\'s Guide Premium Membership' }
];

export const MOCK_DEAL_CATEGORIES = [
  'Advertising',
  'Directories',
  'Education',
  'Events',
  'HR Market Smarts'
];

export const INITIAL_FORMS: FormItem[] = [
  {
    id: '1722403227705',
    name: '2025 HR Leaders State of Employer Branding',
    description: 'This is a sample description for the employer branding form.',
    buttonText: 'Download Report',
    calendarLink: 'https://calendly.com/hr',
    thankYouMessage: 'Thank you for downloading the report!',
    submissionsCount: 154,
    clicksCount: 300,
    conversionsCount: 154,
    peopleScore: 4.8,
    author: 'Jason Clark',
    createdAt: '2024-07-31',
    formType: 'Lead Form',
    category: 'Education_Certification',
    forceDisplay: false,
    notifyEmails: 'test@hr.com',
    userGroups: ['1614234938174'],
    memberships: ['1168083607759'],
    dealCategory: 'Advertising',
    partnerResellerForm: false,
    dealParentCat: 'Advertising',
    prDealCategory: '',
    feathrTracking: true,
    linkedInTracking: false,
    senderEmail: 'marketing@hr.com',
    emailSubject: 'Your Employer Branding Report',
    emailBody: 'Hello *recipient.firstname*,<br><br>Here is your report!',
    fields: [
      { id: 'work_email', name: 'Email', type: 'typeahead', display: true, category: 'Standard' },
      { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' }
    ]
  },
  {
    id: '1722403432688',
    name: '2026 HR Agency Branding Virtual Event Sign Up',
    description: 'Sign up for our upcoming virtual event on HR agency branding.',
    buttonText: 'Register Now',
    calendarLink: '',
    thankYouMessage: 'You have successfully registered!',
    submissionsCount: 89,
    clicksCount: 150,
    conversionsCount: 89,
    peopleScore: 4.2,
    author: 'Jason Clark',
    createdAt: '2024-07-31',
    formType: 'Sign Up Form',
    category: 'Events',
    forceDisplay: true,
    notifyEmails: 'events@hr.com',
    userGroups: ['1614234926907'],
    memberships: ['1175693258470'],
    dealCategory: 'Events',
    partnerResellerForm: false,
    dealParentCat: 'Events',
    prDealCategory: '',
    feathrTracking: false,
    linkedInTracking: true,
    senderEmail: 'events@hr.com',
    emailSubject: 'Virtual Event Registration Confirmed',
    emailBody: 'Hello *recipient.firstname*,<br><br>You are registered for the event!',
    fields: [
      { id: 'work_email', name: 'Email', type: 'typeahead', display: true, category: 'Standard' },
      { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' },
      { id: 'last_name', name: 'Last Name', type: 'text', display: true, category: 'Standard' }
    ]
  },
  {
    id: '1722403981102',
    name: 'Manage Speaker Proposal & Keynote Submission 2026',
    description: 'Submit your speaker profile and session outline for annual HR conferences.',
    buttonText: 'Submit Speaker Application',
    calendarLink: 'https://calendly.com/hr-speakers',
    thankYouMessage: 'Thank you for submitting your speaker proposal! Our committee will review it.',
    submissionsCount: 42,
    clicksCount: 110,
    conversionsCount: 42,
    peopleScore: 4.9,
    author: 'Sarah Jenkins',
    createdAt: '2024-08-01',
    formType: 'Speaker Form',
    category: 'Events',
    forceDisplay: false,
    notifyEmails: 'speakers@hr.com',
    userGroups: ['1614234938174'],
    memberships: ['1168083607759'],
    dealCategory: 'Events',
    partnerResellerForm: false,
    dealParentCat: 'Events',
    prDealCategory: '',
    feathrTracking: true,
    linkedInTracking: true,
    senderEmail: 'speakers@hr.com',
    emailSubject: 'Speaker Submission Confirmation',
    emailBody: 'Hello *recipient.firstname*,<br><br>We received your speaker proposal.',
    fields: [
      { id: 'work_email', name: 'Email', type: 'typeahead', display: true, category: 'Standard' },
      { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' },
      { id: 'last_name', name: 'Last Name', type: 'text', display: true, category: 'Standard' }
    ]
  },
  {
    id: '1722404092231',
    name: 'Exhibitor & Vendor Sales Lead Inquiry 2025',
    description: 'Inquire about sponsor booths, ad inventory, and lead generation packages.',
    buttonText: 'Request Sales Deck',
    calendarLink: 'https://calendly.com/hr-sales',
    thankYouMessage: 'Thanks for reaching out! A dedicated account executive will contact you shortly.',
    submissionsCount: 215,
    clicksCount: 450,
    conversionsCount: 215,
    peopleScore: 4.7,
    author: 'Michael Vance',
    createdAt: '2024-08-02',
    formType: 'Vendor Sales Lead',
    category: 'Advertising',
    forceDisplay: true,
    notifyEmails: 'sales@hr.com',
    userGroups: ['1614234926907'],
    memberships: ['1175693258470'],
    dealCategory: 'Advertising',
    partnerResellerForm: true,
    dealParentCat: 'Advertising',
    prDealCategory: 'Partner Referral',
    feathrTracking: true,
    linkedInTracking: true,
    senderEmail: 'sales@hr.com',
    emailSubject: 'HR.com Media Kit & Sponsorship Inquiry',
    emailBody: 'Hello *recipient.firstname*,<br><br>Thank you for inquiring about sponsorship opportunities.',
    fields: [
      { id: 'work_email', name: 'Email', type: 'typeahead', display: true, category: 'Standard' },
      { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' },
      { id: 'company', name: 'Your Company', type: 'typeahead', display: true, category: 'Standard' }
    ]
  }
];

export const MOCK_SUBMISSIONS: Record<string, FormSubmission[]> = {
  '1722403227705': [
    {
      id: 'sub1',
      formId: '1722403227705',
      respondentName: 'Alice Johnson',
      respondentEmail: 'alice@example.com',
      submittedAt: '2024-08-01',
      approvalStatus: 'Approved',
      answers: { 'First Name': 'Alice' }
    },
    {
      id: 'sub2',
      formId: '1722403227705',
      respondentName: 'Bob Smith',
      respondentEmail: 'bob@example.com',
      submittedAt: '2024-08-02',
      approvalStatus: 'Pending',
      answers: { 'First Name': 'Bob' }
    }
  ],
  '1722403432688': [
    {
      id: 'sub3',
      formId: '1722403432688',
      respondentName: 'Charlie Davis',
      respondentEmail: 'charlie@example.com',
      submittedAt: '2024-08-03',
      approvalStatus: 'Approved',
      answers: { 'First Name': 'Charlie', 'Last Name': 'Davis' }
    }
  ]
};
