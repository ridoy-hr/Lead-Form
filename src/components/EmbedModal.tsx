import React from 'react';
import { FormItem } from '../types';
import { Copy, Check, Code, X } from 'lucide-react';

interface EmbedModalProps {
  form: FormItem | null;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ form, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!form) return null;

  const embedCode = `<iframe src="https://www.hr.com/leadForm/embed/${form.id}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-['Roboto',sans-serif]">
      <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#CCCCCC] max-w-lg w-full p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#CCCCCC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F2FD] border border-[#5099EC] text-[#1E66BA] flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-[#000000] font-['Inria_Serif',serif]">
              Form Embed Snippet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#000000] hover:bg-[#F2F2F2] p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-[#666666]">
            Paste this snippet into your website or CMS page where you want{' '}
            <strong className="text-[#000000]">{form.name}</strong> to appear:
          </p>

          <div className="relative">
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full font-mono text-xs p-3 bg-[#F5F7F8] border border-[#CCCCCC] rounded-xl text-[#000000] focus:outline-none focus:border-[#5099EC]"
            />
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FFFFFF] border border-[#CCCCCC] shadow-xs rounded-lg text-[#000000] hover:bg-[#F5F7F8] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#018624]" />
                  <span className="text-[#018624]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#666666]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary px-5 py-2 text-xs font-medium border border-[#CCCCCC] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
