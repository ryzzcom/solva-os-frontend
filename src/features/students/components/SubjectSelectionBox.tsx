import React from 'react'
import { Search, Plus, Check, Trash2 } from 'lucide-react'

export const GRADE_1_TO_10_DEFAULT_SUBJECTS = [
  'Mathematics',
  'English Literature',
  'General Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science & IT',
  'Social Studies / History',
  'Urdu / Regional Language',
  'Islamic Studies / Ethics',
]

interface SubjectSelectionBoxProps {
  section?: string
  disabled?: boolean
  subjectSearch: string
  setSubjectSearch: (val: string) => void
  selectedSubjects: string[]
  toggleSubject: (subject: string) => void
  subjectsList: string[]
  onDeleteSubject?: (subject: string) => void
  showAddCustomSubject?: boolean
  setShowAddCustomSubject?: (val: boolean) => void
  newSubjectInput: string
  setNewSubjectInput: (val: string) => void
  onAddCustomSubject: () => void
}

export const SubjectSelectionBox: React.FC<SubjectSelectionBoxProps> = ({
  section,
  disabled = false,
  subjectSearch,
  setSubjectSearch,
  selectedSubjects,
  toggleSubject,
  subjectsList,
  onDeleteSubject,
  showAddCustomSubject = true,
  newSubjectInput,
  setNewSubjectInput,
  onAddCustomSubject,
}) => {
  const isDisabled = disabled || (section !== undefined && !section && selectedSubjects.length === 0)
  
  // Merge pre-loaded Grade 1-10 defaults with current subjects list and selected subjects
  const allSubjects = Array.from(
    new Set([...GRADE_1_TO_10_DEFAULT_SUBJECTS, ...subjectsList, ...selectedSubjects])
  )

  const filteredSubjects = allSubjects.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  )

  return (
    <div className="space-y-2 pt-2">
      <label className="block text-lg font-bold font-urbanist text-[#0f172a]">
        Subject Selection
      </label>
      <div
        className={`border rounded-2xl p-6 space-y-5 transition-all ${
          isDisabled
            ? 'bg-slate-50 border-slate-200 opacity-60 pointer-events-none select-none'
            : 'bg-white border-[#d8dee8] shadow-xs'
        }`}
      >
        {isDisabled && (
          <p className="text-slate-500 font-urbanist font-medium text-base text-center py-2">
            Please select a Class & Section first to view and select Subjects.
          </p>
        )}

        {/* Inner Search & Add Custom Subject Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Search subjects..."
              className="w-full h-11 pl-11 pr-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#2e67b1] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {showAddCustomSubject && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onAddCustomSubject()
                  }
                }}
                placeholder="Custom subject name..."
                className="w-full sm:w-56 h-11 px-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm font-sans focus:outline-none focus:border-[#2e67b1]"
              />
              <button
                type="button"
                onClick={onAddCustomSubject}
                className="h-11 px-4 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl text-sm font-medium font-urbanist shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Plus className="size-4" />
                <span>Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Subjects Checkbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {filteredSubjects.map((subj) => {
            const isChecked = selectedSubjects.includes(subj)
            return (
              <div
                key={subj}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all select-none ${
                  isChecked
                    ? 'border-[#2e67b1] bg-blue-50/50 text-[#2e67b1]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div
                  onClick={() => toggleSubject(subj)}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div
                    className={`size-5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-[#2e67b1] border-[#2e67b1] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="size-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm font-medium font-sans truncate">{subj}</span>
                </div>

                {/* Delete Subject Option */}
                {onDeleteSubject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSubject(subj)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                    title={`Delete ${subj}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
