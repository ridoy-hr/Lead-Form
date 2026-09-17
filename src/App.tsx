import React, { useState } from 'react';
import { FormItem, FormSubmission } from './types';
import { INITIAL_FORMS, MOCK_SUBMISSIONS } from './data/mockData';
import { OverviewPage } from './components/OverviewPage';
import { FormEditorPage } from './components/FormEditorPage';
import { EmbedModal } from './components/EmbedModal';
import { SubmissionsModal } from './components/SubmissionsModal';
import { 
  CheckCircle2, 
  Layers, 
  Plus, 
  FolderKanban, 
  Tag, 
  FileText, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [forms, setForms] = useState<FormItem[]>(INITIAL_FORMS);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, FormSubmission[]>>(
    MOCK_SUBMISSIONS
  );

  // Active View State: 'overview' | 'editor'
  const [activeView, setActiveView] = useState<'overview' | 'editor'>('overview');
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const [activeOverviewTab, setActiveOverviewTab] = useState<'forms' | 'deal_categories'>('forms');

  // Modal States
  const [embedForm, setEmbedForm] = useState<FormItem | null>(null);
  const [submissionsForm, setSubmissionsForm] = useState<FormItem | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleAddForm = () => {
    setEditingForm(null);
    setActiveView('editor');
  };

  const handleEditForm = (form: FormItem) => {
    setEditingForm(form);
    setActiveView('editor');
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(prev => prev.filter(f => f.id !== formId));
      showToast('Form deleted successfully.');
    }
  };

  const handleCopyForm = (formToCopy: FormItem) => {
    const duplicated: FormItem = {
      ...formToCopy,
      id: String(Date.now()),
      name: `[COPIED] ${formToCopy.name}`,
      createdAt: new Date().toISOString().slice(0, 10),
      submissionsCount: 0,
      clicksCount: 0
    };
    setForms(prev => [duplicated, ...prev]);
    showToast(`Form duplicated as "[COPIED] ${formToCopy.name.slice(0, 30)}..."`);
  };

  const handleSaveForm = (savedForm: FormItem) => {
    setForms(prev => {
      const exists = prev.some(f => f.id === savedForm.id);
      if (exists) {
        return prev.map(f => (f.id === savedForm.id ? savedForm : f));
      } else {
        return [savedForm, ...prev];
      }
    });

    setActiveView('overview');
    showToast('Form configuration saved successfully!');
  };

  const handleUpdateSubmissionStatus = (
    subId: string,
    status: 'Approved' | 'Denied' | 'Pending'
  ) => {
    if (!submissionsForm) return;

    setSubmissionsMap(prev => {
      const list = prev[submissionsForm.id] || [];
      const updatedList = list.map(s => (s.id === subId ? { ...s, approvalStatus: status } : s));
      return { ...prev, [submissionsForm.id]: updatedList };
    });

    showToast(`Response status updated to "${status}".`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-['Roboto',sans-serif] text-[#000000] antialiased flex flex-col selection:bg-[#018624] selection:text-[#FFFFFF]">
      {/* Brand Header Navigation Bar */}
      <header className="bg-[#FFFFFF] border-b border-[#CCCCCC] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => {
                setActiveView('overview');
                setActiveOverviewTab('forms');
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#018624] flex items-center justify-center text-[#FFFFFF] font-['Inria_Serif',serif] font-bold text-xl shadow-xs group-hover:bg-[#00651B] transition-colors">
                HR
              </div>
              <div>
                <span className="font-['Inria_Serif',serif] text-lg font-bold text-[#000000] block leading-tight">
                  HR.com Portal
                </span>
                <span className="text-xs text-[#666666] font-medium">
                  Lead Forms & CRM Automation
                </span>
              </div>
            </div>

            {/* Persistent Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-[#CCCCCC] pl-6">
              <button
                onClick={() => {
                  setActiveView('overview');
                  setActiveOverviewTab('forms');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeView === 'overview' && activeOverviewTab === 'forms'
                    ? 'bg-[#E5F6E9] text-[#018624] font-semibold border border-[#2BC841]'
                    : 'text-[#666666] hover:bg-[#F2F2F2] hover:text-[#000000]'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Form Inventory</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('overview');
                  setActiveOverviewTab('deal_categories');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeView === 'overview' && activeOverviewTab === 'deal_categories'
                    ? 'bg-[#EBF0F2] text-[#2D5564] font-semibold border border-[#AEC4CB]'
                    : 'text-[#666666] hover:bg-[#F2F2F2] hover:text-[#000000]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Deal Categories</span>
              </button>
            </nav>
          </div>

          {/* User Profile & Quick Action */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddForm}
              className="btn-primary px-3.5 py-2 text-xs font-medium shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Form</span>
            </button>

            {/* Brand Avatar with status indicator: size 40x40, rounded 16px, border 1px #CCCCCC, green dot 10x10 */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#CCCCCC]">
              <div className="relative">
                <div className="w-10 h-10 rounded-[16px] bg-[#F2F2F2] border border-[#CCCCCC] flex items-center justify-center text-sm font-semibold text-[#000000]">
                  HR
                </div>
                {/* Status indicator: Green dot, size 10x10, bottom right */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#02A82D] rounded-full ring-2 ring-[#FFFFFF]" />
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-semibold text-[#000000] leading-tight">Admin User</span>
                <span className="block text-[11px] text-[#666666]">mridoy@hr.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification (Semantic Success Color Spec) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#E5F6E9] border border-[#2BC841] text-[#018624] px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-[#018624] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-1 max-w-[1800px] w-full mx-auto">
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeView === 'overview' ? (
            <OverviewPage
              forms={forms}
              initialTab={activeOverviewTab}
              onTabChange={tab => setActiveOverviewTab(tab)}
              onAddForm={handleAddForm}
              onEditForm={handleEditForm}
              onDeleteForm={handleDeleteForm}
              onCopyForm={handleCopyForm}
              onViewSubmissions={form => setSubmissionsForm(form)}
              onOpenEmbed={form => setEmbedForm(form)}
            />
          ) : (
            <FormEditorPage
              form={editingForm}
              onSave={handleSaveForm}
              onCancel={() => {
                setActiveView('overview');
                setActiveOverviewTab('forms');
              }}
            />
          )}
        </main>
      </div>

      {/* Embed Modal */}
      {embedForm && <EmbedModal form={embedForm} onClose={() => setEmbedForm(null)} />}

      {/* Submissions Modal */}
      {submissionsForm && (
        <SubmissionsModal
          form={submissionsForm}
          submissions={submissionsMap[submissionsForm.id] || []}
          onClose={() => setSubmissionsForm(null)}
          onUpdateStatus={handleUpdateSubmissionStatus}
        />
      )}
    </div>
  );
}
