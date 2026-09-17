import React, { useState } from 'react';
import { FormItem, FormSubmission } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Search, X, Users, Tag } from 'lucide-react';

interface SubmissionsModalProps {
  form: FormItem | null;
  submissions: FormSubmission[];
  onClose: () => void;
  onUpdateStatus: (submissionId: string, status: 'Approved' | 'Denied' | 'Pending') => void;
}

export const SubmissionsModal: React.FC<SubmissionsModalProps> = ({
  form,
  submissions,
  onClose,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchText] = useState('');

  if (!form) return null;

  const filtered = submissions.filter(
    s =>
      s.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.respondentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(s.answers).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-['Roboto',sans-serif]">
      <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#CCCCCC] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#CCCCCC] flex items-center justify-between bg-[#F2F2F2]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-[#666666] hover:text-[#000000] p-1.5 rounded-lg hover:bg-[#E4E4E4] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#000000] font-['Inria_Serif',serif]">
                Lead Submissions & Responses
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                {form.name} &bull; <span className="font-semibold text-[#000000]">{submissions.length} Total Records</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#000000] p-1.5 rounded-lg hover:bg-[#E4E4E4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="p-4 border-b border-[#CCCCCC] bg-[#FFFFFF] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Search response answers or email..."
              value={searchTerm}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl focus:outline-none focus:border-[#5099EC] text-[#000000]"
            />
          </div>
          <div className="text-xs text-[#666666]">
            Showing <strong className="text-[#000000]">{filtered.length}</strong> matching entries
          </div>
        </div>

        {/* Submissions List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#F5F7F8]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-[#FFFFFF] rounded-2xl border border-[#CCCCCC]">
              <p className="text-[#666666] text-sm">No submissions match your search query.</p>
            </div>
          ) : (
            filtered.map(sub => (
              <div
                key={sub.id}
                className="bg-[#FFFFFF] border border-[#CCCCCC] rounded-2xl p-5 shadow-2xs hover:border-[#999999] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#CCCCCC]">
                  <div>
                    <h4 className="text-sm font-bold text-[#000000]">{sub.respondentName}</h4>
                    <span className="text-xs text-[#666666]">{sub.respondentEmail} &bull; Submitted {sub.submittedAt}</span>
                  </div>

                  {/* Approval Actions with brand semantic styling */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#666666]">Status:</span>
                    <button
                      onClick={() => onUpdateStatus(sub.id, 'Approved')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        sub.approvalStatus === 'Approved'
                          ? 'bg-[#E5F6E9] text-[#018624] border border-[#2BC841]'
                          : 'bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC] hover:bg-[#E5F6E9]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#018624]" />
                      <span>Approved</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus(sub.id, 'Denied')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        sub.approvalStatus === 'Denied'
                          ? 'bg-[#FFE3E3] text-[#E13838] border border-[#E06764]'
                          : 'bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC] hover:bg-[#FFE3E3]'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-[#E13838]" />
                      <span>Denied</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus(sub.id, 'Pending')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                        sub.approvalStatus === 'Pending'
                          ? 'bg-[#FEF4E5] text-[#FB9302] border border-[#FCBE67]'
                          : 'bg-[#F2F2F2] text-[#666666] border border-[#CCCCCC] hover:bg-[#FEF4E5]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#FB9302]" />
                      <span>Pending</span>
                    </button>
                  </div>
                </div>

                {/* Answers Grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(sub.answers).map(([qKey, val]) => (
                    <div key={qKey} className="bg-[#F5F7F8] p-3 rounded-xl border border-[#CCCCCC]">
                      <span className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-0.5">
                        {qKey.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium text-[#000000] break-words">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#CCCCCC] bg-[#FFFFFF] flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary px-5 py-2 text-xs font-medium border border-[#CCCCCC] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
