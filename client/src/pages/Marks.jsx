import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Loader';
import { Plus, Edit2, Trash2, Loader2, Award, User, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import { getGradeBadgeColor } from '../utils/formatters';

export const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    student: '',
    subject: '',
    term: 'Term 1',
    marks: '',
  });
  const [selectedMarkId, setSelectedMarkId] = useState(null);

  // Calculate live grade & status info for form
  const getGradeDetails = (score) => {
    const num = Number(score);
    if (isNaN(num) || score === '' || score === null) {
      return { grade: '-', label: 'Enter score (0-100)', color: 'text-gray-400 bg-gray-100 dark:bg-gray-800' };
    }
    if (num >= 75) return { grade: 'A', label: 'Distinction (75-100)', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300' };
    if (num >= 65) return { grade: 'B', label: 'Very Good (65-74)', color: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300' };
    if (num >= 50) return { grade: 'C', label: 'Credit Pass (50-64)', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 border-amber-300' };
    if (num >= 35) return { grade: 'S', label: 'Simple Pass (35-49)', color: 'text-orange-700 bg-orange-100 dark:bg-orange-950/60 border-orange-300' };
    return { grade: 'F', label: 'Fail / Needs Support (<35)', color: 'text-rose-700 bg-rose-100 dark:bg-rose-950/60 border-rose-300' };
  };

  // Fetch dropdown lists (students & subjects)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [stuRes, subjRes] = await Promise.all([
          api.get('/students?limit=200'),
          api.get('/subjects'),
        ]);
        setStudents(stuRes.data.data || []);
        setSubjects(subjRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load options');
      }
    };
    fetchOptions();
  }, []);

  const fetchMarks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search,
        className: selectedClass,
        subject: selectedSubject,
        term: selectedTerm,
      };
      const res = await api.get('/marks', { params });
      setMarks(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0, limit: 10 });
    } catch (err) {
      toast.error('Failed to load mark records');
    } finally {
      setLoading(false);
    }
  }, [search, selectedClass, selectedSubject, selectedTerm]);

  useEffect(() => {
    fetchMarks(1);
  }, [fetchMarks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/marks', {
        student: formData.student,
        subject: formData.subject,
        term: formData.term,
        marks: Number(formData.marks),
      });
      toast.success('Mark record saved successfully');
      setIsAddModalOpen(false);
      resetForm();
      fetchMarks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save mark record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/marks/${formData.id}`, {
        student: formData.student,
        subject: formData.subject,
        term: formData.term,
        marks: Number(formData.marks),
      });
      toast.success('Mark record updated');
      setIsEditModalOpen(false);
      resetForm();
      fetchMarks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update mark record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMarkId) return;
    setSubmitting(true);
    try {
      await api.delete(`/marks/${selectedMarkId}`);
      toast.success('Mark record deleted');
      setIsDeleteModalOpen(false);
      setSelectedMarkId(null);
      fetchMarks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete mark record');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (mark) => {
    setFormData({
      id: mark._id,
      student: mark.student?._id || mark.student,
      subject: mark.subject?._id || mark.subject,
      term: mark.term,
      marks: mark.marks,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setSelectedMarkId(id);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      student: students[0]?._id || '',
      subject: subjects[0]?._id || '',
      term: 'Term 1',
      marks: '',
    });
  };

  const gradeInfo = getGradeDetails(formData.marks);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Marks & Evaluation Directory
          </h1>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-purple-900 hover:bg-purple-600 text-white font-medium rounded-xl text-xs shadow-xs transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mark Entry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200/70 dark:border-gray-700/60 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search student name..." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Classes</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 11-A">Grade 11-A</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.name} ({subj.code})
              </option>
            ))}
          </select>

          {/* Term Filter */}
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700/60 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : marks.length === 0 ? (
          <EmptyState
            title="No mark entries found"
            message="No score records match your active search filters."
            icon={Award}
            actionLabel="Add Mark Entry"
            onAction={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs sm:text-sm">
                  {marks.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Student Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {item.student?.name ? item.student.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white block">
                              {item.student?.name || 'Unknown Student'}
                            </span>
                            <span className="font-mono text-xs text-gray-400">
                              {item.student?.indexNo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300">
                          {item.student?.className || '-'}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">
                        {item.subject?.name || 'Unknown'}
                        <span className="ml-1.5 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                          ({item.subject?.code})
                        </span>
                      </td>

                      {/* Term */}
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300">
                          {item.term}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {item.marks}
                        </span>
                        <span className="text-xs text-gray-400 ml-0.5">/100</span>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${getGradeBadgeColor(
                            item.grade
                          )}`}
                        >
                          {item.grade}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-lg transition-colors"
                            title="Edit Mark"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item._id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-lg transition-colors"
                            title="Delete Mark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={(p) => fetchMarks(p)}
            />
          </>
        )}
      </div>

      {/* Redesigned Ultra-Professional Add / Edit Mark Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isEditModalOpen ? 'Edit Score Evaluation' : 'Record New Examination Score'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={isEditModalOpen ? handleUpdate : handleCreate} className="space-y-4">
          {/* Step 1: Student Selector Card */}
          <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Student Profile *</span>
            </label>
            <select
              required
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
            >
              <option value="" disabled>
                -- Select Enrolled Student --
              </option>
              {students.map((stu) => (
                <option key={stu._id} value={stu._id}>
                  {stu.name} ({stu.indexNo}) • {stu.className}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Subject & Term Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Subject *</span>
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
              >
                <option value="" disabled>
                  -- Select Subject --
                </option>
                {subjects.map((subj) => (
                  <option key={subj._id} value={subj._id}>
                    {subj.name} ({subj.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Term */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Academic Term *</span>
              </label>
              <select
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
          </div>

          {/* Step 3: Score & Dynamic Grade Card */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Examination Score (0 - 100) *</span>
              </label>

              {/* Dynamic Live Grade Tag */}
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${gradeInfo.color}`}>
                Grade {gradeInfo.grade}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                placeholder="Enter numerical score (e.g. 85)"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
              />
            </div>

            {/* Score Progress Visual Bar */}
            <div className="space-y-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, Number(formData.marks) || 0))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>{gradeInfo.label}</span>
                <span>{Number(formData.marks) || 0} / 100</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2.5 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Entry...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isEditModalOpen ? 'Save Changes' : 'Save Mark Entry'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Score Record"
        message="Are you sure you want to delete this score record?"
        loading={submitting}
      />
    </div>
  );
};

export default Marks;
