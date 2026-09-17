import React, { useState } from 'react';
import { FormItem } from '../types';
import {
  MOCK_USER_GROUPS,
  MOCK_MEMBERSHIPS,
  MOCK_DEAL_CATEGORIES
} from '../data/mockData';
import {
  Save,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileUp,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  List,
  Eye,
  Mail,
  Users,
  Briefcase,
  Sliders,
  Globe,
  Settings,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface FormEditorPageProps {
  form: FormItem | null;
  onSave: (savedForm: FormItem) => void;
  onCancel: () => void;
}

const DEFAULT_FIELDS = [
  { id: 'work_email', name: 'Work Email Address', type: 'typeahead', readonly: true },
  { id: 'first_name', name: 'First Name', type: 'text', readonly: true },
  { id: 'last_name', name: 'Last Name', type: 'text', readonly: true },
  { id: 'company', name: 'Company Name', type: 'typeahead' },
  { id: 'title', name: 'Job Title', type: 'typeahead' },
  { id: 'phone', name: 'Phone Number', type: 'text' },
  { id: 'country', name: 'Country', type: 'typeahead' },
  { id: 'state', name: 'State/Province', type: 'typeahead' },
  { id: 'zip', name: 'Postal / Zip Code', type: 'text' },
  { id: 'company_size', name: 'Company Size', type: 'typeahead' },
  { id: 'industry', name: 'Industry', type: 'typeahead' },
  { id: 'opt_in', name: 'Opt-in Consent', type: 'checkbox' }
];

export const FormEditorPage: React.FC<FormEditorPageProps> = ({
  form,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormItem>(() => {
    if (form) {
      return { ...form };
    }
    return {
      id: String(Date.now()),
      name: '',
      description: '',
      buttonText: 'Submit Inquiry',
      calendarLink: '',
      thankYouMessage: 'Thank you for your interest. We will contact you soon.',
      submissionsCount: 0,
      clicksCount: 0,
      conversionsCount: 0,
      peopleScore: 4.8,
      author: 'Admin User',
      createdAt: new Date().toISOString().slice(0, 10),
      formType: 'Lead Generation',
      category: 'Advertising',
      forceDisplay: false,
      notifyEmails: '',
      userGroups: ['1614234926907'],
      memberships: ['1175693258470'],
      dealCategory: 'Advertising',
      partnerResellerForm: false,
      dealParentCat: 'Advertising',
      prDealCategory: 'Partner Referral',
      feathrTracking: false,
      linkedInTracking: false,
      senderEmail: 'leads@hr.com',
      emailSubject: 'HR.com Form Submission Confirmation',
      emailBody: 'Hello *recipient.firstname*,<br><br>Thank you for filling out the form.',
      fields: [
        { id: 'work_email', name: 'Work Email Address', type: 'typeahead', display: true, category: 'Standard' },
        { id: 'first_name', name: 'First Name', type: 'text', display: true, category: 'Standard' },
        { id: 'last_name', name: 'Last Name', type: 'text', display: true, category: 'Standard' }
      ]
    };
  });

  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>({
    formSettings: true,
    formFields: true,
    displaySettings: true,
    notificationSettings: true,
    groupSettings: true,
    dealSettings: true,
    partnerSettings: true,
    trackingSettings: true,
    emailSettings: true,
    assetSettings: true,
    logoSettings: true,
    emailPreview: false
  });

  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    if (form && form.fields) {
      return form.fields.map(f => f.id);
    }
    return ['work_email', 'first_name', 'last_name', 'company', 'title'];
  });

  const togglePanel = (panelKey: string) => {
    setExpandedPanels(prev => ({ ...prev, [panelKey]: !prev[panelKey] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (e.target.multiple) {
      const select = e.target as HTMLSelectElement;
      const selectedValues = Array.from(select.selectedOptions).map(opt => opt.value);
      setFormData(prev => ({ ...prev, [name]: selectedValues }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFieldToggle = (id: string) => {
    setSelectedFields(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Form Name is required.');
      return;
    }

    const finalFields = DEFAULT_FIELDS.filter(f => selectedFields.includes(f.id)).map(f => ({
      id: f.id,
      name: f.name,
      type: f.type as any,
      display: true
    }));

    onSave({ ...formData, fields: finalFields });
  };

  return (
    <div className="max-w-[1280px] mx-auto pb-28 space-y-6 font-['Roboto',sans-serif]">
      {/* Top Header Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#CCCCCC]">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary px-3.5 py-2 text-xs font-medium border border-[#CCCCCC] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#018624]" />
            <span>Back to Forms</span>
          </button>
          <div className="h-5 w-px bg-[#CCCCCC]" />
          <div>
            <h2 className="text-2xl font-bold text-[#000000] font-['Inria_Serif',serif]">
              {form ? 'Edit Lead Form' : 'Create New Lead Form'}
            </h2>
            <p className="text-xs text-[#666666]">
              {form ? `Configuring ID: ${form.id}` : 'Set up form fields, notifications, and CRM deal categories.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="btn-primary px-5 py-2.5 text-sm font-medium shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary px-4 py-2.5 text-sm font-medium border border-[#CCCCCC] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Brand Alert Box (Semantic Alert Tokens) */}
      <div className="bg-[#FEF4E5] border border-[#FCBE67] text-[#FB9302] p-4 rounded-xl text-xs font-medium shadow-2xs">
        <div className="flex items-center gap-2 text-[#000000] font-semibold mb-1">
          <AlertCircle className="w-4 h-4 text-[#FB9302] shrink-0" />
          <span>Editor Guidelines & Clean Input Notice:</span>
        </div>
        <ul className="list-disc pl-6 space-y-1 text-[#333333]">
          <li>To avoid copying unnecessary HTML tags and symbols, please copy plain text into editor fields.</li>
          <li>Double quotes in field names will be auto-sanitized for clean CSV export.</li>
          <li>Assigning an accurate <strong>Deal Category</strong> enables direct routing into the sales pipeline.</li>
        </ul>
      </div>

      {/* Main Form Settings Cards */}
      <div className="bg-[#FFFFFF] rounded-2xl shadow-xs border border-[#CCCCCC] overflow-hidden divide-y divide-[#CCCCCC]">
        
        {/* 1. Form Settings */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-[#2D5564]" />
              <span>General Form Settings</span>
            </h4>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
                Form Name <span className="text-[#E13838]">*</span>
              </label>
              <div className="col-span-12 sm:col-span-9">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Exhibitor & Keynote Speaker Application 2026"
                  className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                  required
                />
                <span className="text-xs text-[#999999] mt-1 block">Displayed in portal inventory and embed headers</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
                Form Category
              </label>
              <div className="col-span-12 sm:col-span-9">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                >
                  <option value="Advertising">Advertising</option>
                  <option value="Events">Events</option>
                  <option value="Education">Education</option>
                  <option value="Research">Research</option>
                  <option value="Memberships">Memberships</option>
                  <option value="Webcasts">Webcasts</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000] mt-2">
                Description
              </label>
              <div className="col-span-12 sm:col-span-9">
                <div className="border border-[#CCCCCC] rounded-xl overflow-hidden bg-[#FFFFFF]">
                  <div className="bg-[#F2F2F2] border-b border-[#CCCCCC] p-2 flex gap-2">
                    <button type="button" className="p-1 hover:bg-[#E4E4E4] rounded-md"><Bold className="w-4 h-4 text-[#666666]" /></button>
                    <button type="button" className="p-1 hover:bg-[#E4E4E4] rounded-md"><Italic className="w-4 h-4 text-[#666666]" /></button>
                    <button type="button" className="p-1 hover:bg-[#E4E4E4] rounded-md"><Underline className="w-4 h-4 text-[#666666]" /></button>
                  </div>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short summary for respondents..."
                    className="w-full p-3 text-sm text-[#000000] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
                Button CTA Text
              </label>
              <div className="col-span-12 sm:col-span-9">
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="Submit Inquiry"
                  className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
                Calendar Booking Link
              </label>
              <div className="col-span-12 sm:col-span-9">
                <input
                  type="url"
                  name="calendarLink"
                  value={formData.calendarLink}
                  onChange={handleChange}
                  placeholder="https://calendly.com/hr-team"
                  className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                />
                <span className="text-xs text-[#999999] mt-1 block">Optional Calendly or meeting scheduler redirect</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000] mt-2">
                Thank You Message
              </label>
              <div className="col-span-12 sm:col-span-9">
                <textarea
                  name="thankYouMessage"
                  rows={3}
                  value={formData.thankYouMessage}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Form Fields Selector (Accordion Spec with Table) */}
        <div>
          <div 
            className="p-6 bg-[#F5F7F8] flex items-center justify-between cursor-pointer hover:bg-[#EBF0F2] transition-colors"
            onClick={() => togglePanel('formFields')}
          >
            <h4 className="text-md font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2">
              <List className="w-5 h-5 text-[#018624]" />
              <span>Form Fields & Input Schema ({selectedFields.length} Active)</span>
            </h4>
            {expandedPanels['formFields'] ? <ChevronUp className="w-5 h-5 text-[#666666]" /> : <ChevronDown className="w-5 h-5 text-[#666666]" />}
          </div>
          
          {expandedPanels['formFields'] && (
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F2F2F2] border-b-2 border-[#2BC841]">
                  <tr>
                    <th className="py-3 px-6 text-xs font-semibold text-[#000000]">Field Name</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[#000000]">Input Type</th>
                    <th className="py-3 px-6 text-xs font-semibold text-[#000000] text-center">Include in Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CCCCCC] text-sm">
                  {DEFAULT_FIELDS.map((field) => (
                    <tr key={field.id} className="hover:bg-[#F5F7F8] transition-colors">
                      <td className="py-3 px-6 text-sm font-medium text-[#000000]">
                        {field.name}
                        {field.readonly && <span className="ml-2 text-xs text-[#E13838] font-normal">(Required Baseline)</span>}
                      </td>
                      <td className="py-3 px-6 text-xs text-[#666666] font-mono">{field.type}</td>
                      <td className="py-3 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.id)}
                          onChange={() => handleFieldToggle(field.id)}
                          disabled={field.readonly}
                          className="w-4 h-4 rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC] disabled:opacity-60 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Deal Settings (Sales Pipeline Route) */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#2D5564]" />
            <span>Deal & CRM Pipeline Settings</span>
          </h4>
          
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Deal Category <span className="text-[#E13838]">*</span>
            </label>
            <div className="col-span-12 sm:col-span-9">
              <select
                name="dealCategory"
                value={formData.dealCategory}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
              >
                <option value="">Select Deal Category</option>
                {MOCK_DEAL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="text-xs text-[#999999] mt-1 block">Leads will be automatically tagged and routed to this sales pipeline</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Partner / Reseller Form
            </label>
            <div className="col-span-12 sm:col-span-9 flex items-center gap-3">
              <input
                type="checkbox"
                name="partnerResellerForm"
                checked={formData.partnerResellerForm}
                onChange={handleChange}
                className="w-5 h-5 rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC] cursor-pointer"
              />
              <span className="text-xs text-[#666666]">Enable partner referral commissions & deal sharing</span>
            </div>
          </div>
        </div>

        {/* 4. Notification Settings */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#2D5564]" />
            <span>Notification & Email Alerts</span>
          </h4>
          
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Lead Alert Emails
            </label>
            <div className="col-span-12 sm:col-span-9">
              <input
                type="text"
                name="notifyEmails"
                value={formData.notifyEmails}
                onChange={handleChange}
                placeholder="sales@hr.com, manager@hr.com"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
              />
              <span className="text-xs text-[#999999] mt-1 block">Separate multiple email addresses with commas</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Sender Email <span className="text-[#E13838]">*</span>
            </label>
            <div className="col-span-12 sm:col-span-9">
              <input
                type="email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleChange}
                placeholder="notifications@hr.com"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Auto-Reply Subject <span className="text-[#E13838]">*</span>
            </label>
            <div className="col-span-12 sm:col-span-9">
              <input
                type="text"
                name="emailSubject"
                value={formData.emailSubject}
                onChange={handleChange}
                placeholder="Thank you for your submission"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000] mt-2">
              Auto-Reply Body <span className="text-[#E13838]">*</span>
            </label>
            <div className="col-span-12 sm:col-span-9">
              <textarea
                name="emailBody"
                rows={4}
                value={formData.emailBody}
                onChange={handleChange}
                className="w-full p-3 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
                required
              />
              <span className="text-xs text-[#999999] mt-1 block">Supports variables: *recipient.firstname*, *recipient.lastname*, *recipient.company*</span>
            </div>
          </div>
        </div>

        {/* 5. User Groups & Memberships */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#2D5564]" />
            <span>Target Groups & Access Permissions</span>
          </h4>
          
          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000] mt-2">
              User Groups
            </label>
            <div className="col-span-12 sm:col-span-9">
              <select
                multiple
                name="userGroups"
                value={formData.userGroups}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none h-36"
              >
                {MOCK_USER_GROUPS.map(grp => (
                  <option key={grp.id} value={grp.id}>{grp.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000] mt-2">
              Membership Tier
            </label>
            <div className="col-span-12 sm:col-span-9">
              <select
                multiple
                name="memberships"
                value={formData.memberships}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none h-28"
              >
                {MOCK_MEMBERSHIPS.map(mem => (
                  <option key={mem.id} value={mem.id}>{mem.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6. Assets & Tracking Settings */}
        <div className="p-6 sm:p-8 space-y-6">
          <h4 className="text-lg font-bold text-[#000000] font-['Inter',sans-serif] flex items-center gap-2.5">
            <FileUp className="w-5 h-5 text-[#2D5564]" />
            <span>Downloadable Asset & Campaign Tracking</span>
          </h4>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Download Asset URL
            </label>
            <div className="col-span-12 sm:col-span-9">
              <input
                type="url"
                name="downloadableLink"
                value={formData.downloadableLink || ''}
                onChange={handleChange}
                placeholder="https://hr.com/whitepapers/research-report-2026.pdf"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl text-sm text-[#000000] focus:border-[#5099EC] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-12 sm:col-span-3 text-sm font-semibold text-[#000000]">
              Analytics Tracking
            </label>
            <div className="col-span-12 sm:col-span-9 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  name="feathrTracking"
                  checked={formData.feathrTracking}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC]"
                />
                <span>Enable Feathr Tracking</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  name="linkedInTracking"
                  checked={formData.linkedInTracking}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC]"
                />
                <span>Enable LinkedIn Insights Tag</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="btn-secondary px-6 py-2.5 text-sm font-medium border border-[#CCCCCC] cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn-primary px-8 py-2.5 text-sm font-medium shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Form</span>
        </button>
      </div>
    </div>
  );
};
