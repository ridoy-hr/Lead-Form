import React, { useState } from 'react';
import { FormItem, FilterOptions } from '../types';
import {
  MOCK_DEAL_CATEGORIES,
} from '../data/mockData';
import {
  Search,
  Download,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Code,
  Eye,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  FolderKanban,
  Tag,
  Layers,
  ArrowLeft,
  Filter,
  Check
} from 'lucide-react';

interface OverviewPageProps {
  forms: FormItem[];
  onAddForm: () => void;
  onEditForm: (form: FormItem) => void;
  onDeleteForm: (formId: string) => void;
  onCopyForm: (form: FormItem) => void;
  onViewSubmissions: (form: FormItem) => void;
  onOpenEmbed: (form: FormItem) => void;
  initialTab?: 'forms' | 'deal_categories';
  onTabChange?: (tab: 'forms' | 'deal_categories') => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  forms,
  onAddForm,
  onEditForm,
  onDeleteForm,
  onCopyForm,
  onViewSubmissions,
  onOpenEmbed,
  initialTab = 'forms',
  onTabChange
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    formType: 'All',
    category: 'All',
    page: 1,
    pageSize: 10
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof FormItem>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Sub-view Tab within Overview: 'forms' | 'deal_categories'
  const [subTab, setSubTabState] = useState<'forms' | 'deal_categories'>(initialTab);
  
  const setSubTab = (tab: 'forms' | 'deal_categories') => {
    setSubTabState(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [dealCatList, setDealCatList] = useState<string[]>(MOCK_DEAL_CATEGORIES);
  const [newDealInput, setNewDealInput] = useState('');
  const [dealCategorySearch, setDealCategorySearch] = useState('');
  const [dealCategorySuccess, setDealCategorySuccess] = useState<string | null>(null);

  // Filter Logic
  const filteredForms = forms.filter(form => {
    const matchesSearch =
      form.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      form.id.includes(filters.search) ||
      form.author.toLowerCase().includes(filters.search.toLowerCase()) ||
      form.dealCategory?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.formType === 'All' || form.formType === filters.formType;
    const matchesCat = filters.category === 'All' || form.category === filters.category;

    return matchesSearch && matchesType && matchesCat;
  });

  // Sort Logic
  const sortedForms = [...filteredForms].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA! < valB!) return sortAsc ? -1 : 1;
    if (valA! > valB!) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalResults = sortedForms.length;
  const startIndex = (filters.page - 1) * filters.pageSize;
  const paginatedForms = sortedForms.slice(startIndex, startIndex + filters.pageSize);

  const handleSort = (field: keyof FormItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedForms.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      formType: 'All',
      category: 'All',
      page: 1,
      pageSize: 10
    });
  };

  const handleAddDealCategory = () => {
    const trimmed = newDealInput.trim();
    if (!trimmed) return;
    if (dealCatList.includes(trimmed)) {
      alert(`Category "${trimmed}" already exists.`);
      return;
    }
    setDealCatList(prev => [...prev, trimmed]);
    setNewDealInput('');
    setDealCategorySuccess(`Added "${trimmed}" to deal categories.`);
    setTimeout(() => setDealCategorySuccess(null), 3000);
  };

  const handleDeleteDealCategory = (cat: string) => {
    if (window.confirm(`Are you sure you want to remove "${cat}" from deal categories?`)) {
      setDealCatList(prev => prev.filter(c => c !== cat));
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Form ID', 'Form Name', 'Submissions', 'Author', 'Created At', 'Form Type', 'Category', 'Deal Category'].join(','),
      ...filteredForms.map(f =>
        [
          `"${f.id}"`,
          `"${f.name.replace(/"/g, '""')}"`,
          f.submissionsCount,
          `"${f.author}"`,
          f.createdAt,
          `"${f.formType}"`,
          `"${f.category}"`,
          `"${f.dealCategory || ''}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrcom_forms_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Distinct Form Types and Categories for filters
  const formTypes = ['All', ...Array.from(new Set(forms.map(f => f.formType).filter(Boolean)))];
  const categories = ['All', ...Array.from(new Set(forms.map(f => f.category).filter(Boolean)))];

  const filteredDealCats = dealCatList.filter(c => 
    c.toLowerCase().includes(dealCategorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-24 font-['Roboto',sans-serif]">
      {/* Brand Breadcrumbs & Top Section Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <button
            onClick={() => setSubTab('forms')}
            className="flex items-center gap-1.5 hover:text-[#018624] font-medium transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#018624]" />
            <span>Portal Home</span>
          </button>
          <span>/</span>
          {subTab === 'forms' ? (
            <span className="font-semibold text-[#000000]">Form Inventory</span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubTab('forms')}
                className="hover:text-[#018624] font-medium transition-colors cursor-pointer"
              >
                Form Inventory
              </button>
              <span>/</span>
              <span className="font-semibold text-[#000000]">Deal Categories</span>
            </div>
          )}
        </div>

        {/* Global Navigation Tabs (Persistent Across All Sub-Views) */}
        <div className="flex items-center gap-2 bg-[#E4E4E4] p-1 rounded-xl border border-[#CCCCCC]">
          <button
            onClick={() => setSubTab('forms')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'forms'
                ? 'bg-[#FFFFFF] text-[#000000] shadow-xs font-semibold'
                : 'text-[#666666] hover:text-[#000000]'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-[#018624]" />
            <span>Form Inventory ({forms.length})</span>
          </button>
          <button
            onClick={() => setSubTab('deal_categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              subTab === 'deal_categories'
                ? 'bg-[#FFFFFF] text-[#000000] shadow-xs font-semibold'
                : 'text-[#666666] hover:text-[#000000]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#396B7E]" />
            <span>Deal Categories ({dealCatList.length})</span>
          </button>
        </div>
      </div>

      {subTab === 'forms' ? (
        /* MAIN FORM INVENTORY CONTAINER */
        <div className="bg-[#FFFFFF] shadow-xs rounded-2xl border border-[#CCCCCC] overflow-hidden space-y-0">
          {/* Top Utility Controls Bar */}
          <div className="p-4 bg-[#F2F2F2] border-b border-[#CCCCCC] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#666666]">Type:</span>
                <select
                  value={filters.formType}
                  onChange={e => setFilters(prev => ({ ...prev, formType: e.target.value, page: 1 }))}
                  className="bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl px-3 py-1.5 text-xs text-[#000000] font-medium focus:border-[#5099EC] focus:outline-none"
                >
                  {formTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#666666]">Category:</span>
                <select
                  value={filters.category}
                  onChange={e => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                  className="bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl px-3 py-1.5 text-xs text-[#000000] font-medium focus:border-[#5099EC] focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#CCCCCC] hover:bg-[#F5F7F8] rounded-xl text-[#000000] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#666666]" />
                <span>Reset</span>
              </button>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-[#FFFFFF] border border-[#CCCCCC] hover:bg-[#F5F7F8] rounded-xl text-[#000000] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export Forms as CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#666666]" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
                <input
                  type="text"
                  placeholder="Search forms by name, ID, author..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl focus:outline-none focus:border-[#5099EC] text-[#000000] font-normal"
                />
              </div>

              {/* Top-Right Add Form Button (Primary MP-Green 700) */}
              <button
                onClick={onAddForm}
                className="btn-primary px-4 py-2 text-sm cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Form</span>
              </button>
            </div>
          </div>

          {/* Table Area (Design System: Header #F2F2F2, Border-b 2px #2BC841, Rows #FFFFFF / Hover #F5F7F8) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F2F2F2] text-xs font-medium text-[#000000] border-b-2 border-[#2BC841] select-none">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        paginatedForms.length > 0 &&
                        paginatedForms.every(f => selectedIds.includes(f.id))
                      }
                      className="rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC] cursor-pointer"
                    />
                  </th>

                  <th
                    onClick={() => handleSort('id')}
                    className="py-3 px-4 cursor-pointer hover:bg-[#E4E4E4] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Form ID</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-[#E4E4E4] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Form Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('submissionsCount')}
                    className="py-3 px-4 cursor-pointer hover:bg-[#E4E4E4] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Submissions / Leads</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                    </div>
                  </th>

                  <th className="py-3 px-4">Type & Category</th>
                  <th className="py-3 px-4">Deal Category</th>

                  <th
                    onClick={() => handleSort('author')}
                    className="py-3 px-4 cursor-pointer hover:bg-[#E4E4E4] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Author</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('createdAt')}
                    className="py-3 px-4 cursor-pointer hover:bg-[#E4E4E4] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Created Date</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#666666]" />
                    </div>
                  </th>

                  <th className="py-3 px-4 text-center">Embed</th>
                  <th className="py-3 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#CCCCCC] text-sm text-[#000000]">
                {paginatedForms.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-[#666666] bg-[#FFFFFF]">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-[#CCCCCC]" />
                      <p className="text-base font-medium text-[#333333]">No forms found matching your criteria.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 text-xs text-[#20588E] hover:underline font-medium"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedForms.map(form => {
                    const isSelected = selectedIds.includes(form.id);

                    return (
                      <tr
                        key={form.id}
                        className={`hover:bg-[#F5F7F8] hover:border-[#999999] transition-colors ${
                          isSelected ? 'bg-[#F2FBF5]' : 'bg-[#FFFFFF]'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(form.id)}
                            className="rounded border-[#CCCCCC] text-[#018624] focus:ring-[#5099EC] cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-[#666666] font-medium">
                          {form.id}
                        </td>

                        <td className="py-3.5 px-4 max-w-sm">
                          <div>
                            <button
                              onClick={() => onEditForm(form)}
                              className="font-medium text-[#20588E] hover:text-[#018624] hover:underline text-left line-clamp-1 text-sm cursor-pointer"
                            >
                              {form.name}
                            </button>
                            <span className="text-xs text-[#999999] font-mono block">
                              hr.com/en/app/form/{form.id}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => onViewSubmissions(form)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5F6E9] hover:bg-[#CBEED5] text-[#018624] font-medium text-xs rounded-full border border-[#2BC841] transition-colors cursor-pointer"
                            title="View Leads & Responses"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#018624]" />
                            <span>{form.submissionsCount.toLocaleString()} leads</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-[#000000]">
                              {form.formType}
                            </span>
                            <span className="text-xs text-[#666666]">
                              {form.category}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {form.dealCategory ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF0F2] text-[#2D5564] border border-[#AEC4CB]">
                              <Tag className="w-3 h-3" />
                              <span>{form.dealCategory}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#999999]">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-normal text-[#000000] text-xs">
                          {form.author}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-[#666666]">
                          {form.createdAt}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onOpenEmbed(form)}
                            className="inline-flex items-center gap-1 text-[#20588E] hover:text-[#018624] font-mono text-xs font-medium hover:bg-[#E8F2FD] px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                            title="Get Embed Code"
                          >
                            <Code className="w-3.5 h-3.5" />
                            <span>&lt;/&gt;</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right pr-6 relative">
                          <div className="inline-block text-left">
                            <button
                              onClick={() =>
                                setActiveMenuId(activeMenuId === form.id ? null : form.id)
                              }
                              className="p-1.5 rounded-xl hover:bg-[#E4E4E4] text-[#666666] transition-colors focus:outline-none cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuId === form.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActiveMenuId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-52 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#CCCCCC] py-1.5 z-20 animate-fade-in text-xs font-medium">
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onEditForm(form);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F5F7F8] flex items-center gap-2 text-[#000000] cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-[#20588E]" />
                                    <span>Edit Form Settings</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onViewSubmissions(form);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F5F7F8] flex items-center gap-2 text-[#000000] cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#018624]" />
                                    <span>View Submissions ({form.submissionsCount})</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onOpenEmbed(form);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F5F7F8] flex items-center gap-2 text-[#000000] cursor-pointer"
                                  >
                                    <Code className="w-3.5 h-3.5 text-[#396B7E]" />
                                    <span>Get Embed Snippet</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onCopyForm(form);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F5F7F8] flex items-center gap-2 text-[#000000] cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-[#666666]" />
                                    <span>Duplicate Form</span>
                                  </button>

                                  <div className="h-px bg-[#CCCCCC] my-1" />

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onDeleteForm(form.id);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-[#FFE3E3] flex items-center gap-2 text-[#E13838] cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-[#E13838]" />
                                    <span>Delete Form</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Bar: Pagination */}
          <div className="p-4 border-t border-[#CCCCCC] bg-[#F2F2F2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#666666]">
              Showing <span className="font-semibold text-[#000000]">{totalResults === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#000000]">{Math.min(startIndex + filters.pageSize, totalResults)}</span> of{' '}
              <span className="font-semibold text-[#000000]">{totalResults}</span> forms
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] font-medium">
              <div className="flex items-center gap-2">
                <span>Result per page:</span>
                <select
                  value={filters.pageSize}
                  onChange={e => setFilters(prev => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))}
                  className="bg-[#FFFFFF] border border-[#CCCCCC] rounded-lg px-2.5 py-1 text-xs text-[#000000] focus:outline-none focus:border-[#5099EC]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={filters.page <= 1}
                  className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#CCCCCC] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E4E4E4] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#000000]" />
                </button>
                <span className="px-2 font-medium text-[#000000]">Page {filters.page}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={startIndex + filters.pageSize >= totalResults}
                  className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#CCCCCC] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E4E4E4] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#000000]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DEAL CATEGORIES MANAGER VIEW (Full page with navigation to comeback to homepage) */
        <div className="bg-[#FFFFFF] shadow-xs rounded-2xl border border-[#CCCCCC] p-6 sm:p-8 space-y-6">
          {/* Top Bar with Clear "Back to Homepage" Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CCCCCC] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSubTab('forms')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F2F2] hover:bg-[#E4E4E4] text-[#000000] rounded-xl text-xs font-medium transition-colors border border-[#CCCCCC] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#018624]" />
                  <span>← Back to Form Inventory (Home)</span>
                </button>
                <div className="h-4 w-px bg-[#CCCCCC]" />
                <span className="text-xs text-[#666666]">Sales Pipeline Configuration</span>
              </div>
              <h2 className="text-2xl font-bold text-[#000000] font-['Inria_Serif',serif] mt-2">
                Deal Categories Manager
              </h2>
              <p className="text-xs text-[#666666]">
                Configure deal categories used to auto-assign incoming lead forms to corresponding CRM sales pipelines and partner channels.
              </p>
            </div>

            {/* Quick Home Navigation & Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubTab('forms')}
                className="btn-secondary px-4 py-2 text-xs font-medium cursor-pointer border border-[#CCCCCC]"
              >
                <Home className="w-4 h-4 text-[#018624]" />
                <span>Home</span>
              </button>
              <button
                onClick={onAddForm}
                className="btn-primary px-4 py-2 text-xs font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Form</span>
              </button>
            </div>
          </div>

          {/* Alert / Success notice */}
          {dealCategorySuccess && (
            <div className="p-3 bg-[#E5F6E9] border border-[#2BC841] text-[#018624] rounded-xl text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{dealCategorySuccess}</span>
            </div>
          )}

          {/* Add Category and Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#F5F7F8] p-4 rounded-xl border border-[#D7E1E3]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input
                type="text"
                placeholder="Search deal categories..."
                value={dealCategorySearch}
                onChange={e => setDealCategorySearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl focus:outline-none focus:border-[#5099EC] text-[#000000]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter new category name..."
                value={newDealInput}
                onChange={e => setNewDealInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddDealCategory();
                }}
                className="px-3.5 py-2 text-xs bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl focus:outline-none focus:border-[#5099EC] w-64 text-[#000000]"
              />
              <button
                onClick={handleAddDealCategory}
                className="btn-primary px-4 py-2 text-xs font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Deal Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDealCats.map((cat, idx) => {
              const matchedCount = forms.filter(f => f.dealCategory === cat).length;
              return (
                <div
                  key={cat}
                  className="p-4 bg-[#FFFFFF] border border-[#CCCCCC] rounded-xl flex items-center justify-between hover:bg-[#F5F7F8] hover:border-[#999999] transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#2D5564] text-[#FFFFFF] font-mono text-xs font-bold flex items-center justify-center">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <span className="font-semibold text-sm text-[#000000] block">{cat}</span>
                      <span className="text-xs text-[#666666]">
                        {matchedCount} {matchedCount === 1 ? 'form connected' : 'forms connected'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#018624] bg-[#E5F6E9] border border-[#2BC841] px-2.5 py-0.5 rounded-full">
                      Active Rule
                    </span>
                    <button
                      onClick={() => handleDeleteDealCategory(cat)}
                      className="p-1 text-[#999999] hover:text-[#E13838] hover:bg-[#FFE3E3] rounded-lg transition-colors cursor-pointer"
                      title="Remove category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Back Navigation Bar */}
          <div className="pt-6 border-t border-[#CCCCCC] flex items-center justify-between">
            <button
              onClick={() => setSubTab('forms')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#20588E] hover:text-[#018624] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Form Inventory Homepage</span>
            </button>

            <span className="text-xs text-[#666666]">
              Total {dealCatList.length} categories active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
