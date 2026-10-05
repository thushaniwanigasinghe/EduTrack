import React from 'react';
import { useFetch } from '../hooks/useFetch';
import StatCard from '../components/common/StatCard';
import SubjectAverageChart from '../components/charts/SubjectAverageChart';
import GradeDistributionChart from '../components/charts/GradeDistributionChart';
import { CardSkeleton } from '../components/common/Loader';
import { Users, Percent, RefreshCw, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { data: response, loading, error, refetch } = useFetch('/dashboard/summary');

  const summary = response?.data || {};

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Academic Overview</h1>
          <p className="text-xs text-gray-400">Loading performance data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl h-72 animate-pulse bg-gray-100 dark:bg-gray-700/30"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl h-72 animate-pulse bg-gray-100 dark:bg-gray-700/30"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 max-w-lg mx-auto mt-8">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <h3 className="text-base font-semibold">Unable to load dashboard data</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Academic Performance Summary
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time insights calculated directly from student evaluation records
          </p>
        </div>

        {/* Icon-Only Refresh Button */}
        <button
          onClick={refetch}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-xs"
          title="Refresh Analytics"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 2 Sleek Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Students Enrolled"
          value={summary.totalStudents || 0}
          icon={Users}
          colorScheme="slate"
          subtitle={`${summary.totalSubjects || 0} active subjects enrolled`}
        />
        <StatCard
          title="Academic Pass Rate"
          value={summary.passRate || 0}
          unit="%"
          icon={Percent}
          colorScheme="emerald"
          subtitle="Percentage scoring 35 marks or higher"
        />
      </div>

      {/* Main Analytics (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): Subject Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200/70 dark:border-gray-700/60 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-gray-100 dark:border-gray-700/60 mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Subject-wise Average Scores
              </h2>
              <p className="text-xs text-gray-400">Mean marks scored across all curriculum subjects</p>
            </div>
            <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 rounded-md text-xs font-medium">
              {summary.totalSubjects || 0} Subjects
            </span>
          </div>
          <SubjectAverageChart data={summary.subjectAverages} />
        </div>

        {/* Right Column (1/3 width): Grade Breakdown Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200/70 dark:border-gray-700/60 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-gray-100 dark:border-gray-700/60 mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Grade Breakdown
            </h2>
            <p className="text-xs text-gray-400">Distribution of assigned letter grades</p>
          </div>
          <GradeDistributionChart data={summary.gradeDistribution} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
