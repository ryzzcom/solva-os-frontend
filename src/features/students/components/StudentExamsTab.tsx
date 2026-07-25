import React from 'react'
import { Award, AlertCircle, FileText } from 'lucide-react'
import { useStudentResults } from '../api/useStudentProfile'
import { Skeleton } from '@/components/ui/skeleton'

interface StudentExamsTabProps {
  studentId: string
}

export const StudentExamsTab: React.FC<StudentExamsTabProps> = ({ studentId }) => {
  const { data: results, isLoading, isError, error } = useStudentResults(studentId)

  if (isLoading) {
    return (
      <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
              <Skeleton className="h-6 w-44 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white border border-rose-200 rounded-[16px] p-8 text-center space-y-3 shadow-xs">
        <div className="size-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-lg font-semibold font-urbanist text-slate-900">
          Failed to load examination results
        </h3>
        <p className="text-sm font-sans text-slate-500 max-w-md mx-auto">
          {error?.message || 'An error occurred while fetching examination data.'}
        </p>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white border border-[#d8dee8] rounded-[16px] p-12 text-center space-y-3 shadow-xs animate-in fade-in duration-200">
        <div className="size-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <FileText className="size-6" />
        </div>
        <h3 className="text-xl font-semibold font-urbanist text-[#0f172a]">
          Detailed Examination Log
        </h3>
        <p className="text-sm font-sans text-slate-500 max-w-md mx-auto">
          No examination results recorded for this student yet.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#2e67b1]/10 text-[#2e67b1] flex items-center justify-center">
            <Award className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-urbanist text-[#0f172a] tracking-tight">
              Detailed Examination Log
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Overview of official exam performance, total marks, grades, and status.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium font-sans px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
          Total Exams: {results.length}
        </span>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600 font-urbanist">
              <th className="py-3.5 px-4 md:px-6">Exam Name</th>
              <th className="py-3.5 px-4 md:px-6">Student Name</th>
              <th className="py-3.5 px-4 md:px-6">Registration No</th>
              <th className="py-3.5 px-4 md:px-6">Obtained / Total Marks</th>
              <th className="py-3.5 px-4 md:px-6 text-center">Grade</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-sans">
            {results.map((item, index) => {
              const isPass = item.status.toLowerCase() === 'pass'
              
              // Grade badge styling logic
              let gradeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
              if (item.grade === 'A+' || item.grade === 'A') {
                gradeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
              } else if (item.grade === 'B' || item.grade === 'C') {
                gradeStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
              } else if (item.grade === 'D' || item.grade === 'F') {
                gradeStyle = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
              }

              return (
                <tr
                  key={index}
                  className="hover:bg-slate-50/60 transition-colors duration-150"
                >
                  {/* Exam Name */}
                  <td className="py-4 px-4 md:px-6 font-medium text-[#0f172a] font-urbanist">
                    {item.exam_name}
                  </td>

                  {/* Student Name */}
                  <td className="py-4 px-4 md:px-6 text-slate-600">
                    {item.student_name}
                  </td>

                  {/* Registration No */}
                  <td className="py-4 px-4 md:px-6 text-slate-500 font-mono text-xs">
                    {item.registration_no}
                  </td>

                  {/* Marks / Percentage */}
                  <td className="py-4 px-4 md:px-6 font-semibold text-slate-800 font-urbanist">
                    {item.percentage}
                  </td>

                  {/* Grade Badge */}
                  <td className="py-4 px-4 md:px-6 text-center">
                    <span
                      className={`inline-block px-3 py-0.5 text-xs rounded-md border ${gradeStyle}`}
                    >
                      {item.grade}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 md:px-6 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        isPass
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isPass ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const StudentResultsTab = StudentExamsTab

