import React from 'react'
import { Search, Plus, Check } from 'lucide-react'

interface SubjectSelectionBoxProps {
  section: string
  subjectSearch: string
  setSubjectSearch: (val: string) => void
  selectedSubjects: string[]
  toggleSubject: (subject: string) => void
  subjectsList: string[]
  showAddCustomSubject: boolean
  setShowAddCustomSubject: (val: boolean) => void
  newSubjectInput: string
  setNewSubjectInput: (val: string) => void
  onAddCustomSubject: () => void
}

export const SubjectSelectionBox: React.FC<SubjectSelectionBoxProps> = ({
  section,
  subjectSearch,
  setSubjectSearch,
  selectedSubjects,
  toggleSubject,
  subjectsList,
  showAddCustomSubject,
  setShowAddCustomSubject,
  newSubjectInput,
  setNewSubjectInput,
  onAddCustomSubject,
}) => {
  const filteredSubjects = subjectsList.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  )

  return (
    <div className="space-y-2 pt-2">
      <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
        Subject Selection
      </label>
      <div
        className={`border rounded-[12px] p-6 space-y-5 transition-all ${
          !section
            ? 'bg-slate-50 border-slate-200 opacity-60 pointer-events-none select-none'
            : 'bg-white border-[#d8dee8]'
        }`}
      >
        {!section && (
          <p className="text-slate-500 font-urbanist font-medium text-base text-center py-2">
            Please select a Class & Section first to view and select Subjects.
          </p>
        )}

        {/* Inner Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#94a3b8]" />
          <input
            type="text"
            disabled={!section}
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            placeholder="Search Subjects..."
            className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] pl-12 pr-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors disabled:bg-slate-100"
          />
        </div>

        {section && filteredSubjects.length > 0 && (
          <>
            <hr className="border-[#d8dee8]" />

            {/* Checkbox List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSubjects.map((subj) => {
                const isSelected = selectedSubjects.includes(subj)
                return (
                  <div
                    key={subj}
                    onClick={() => toggleSubject(subj)}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={`size-[20px] rounded-[3px] border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#2e67b1] border-[#2e67b1] text-white'
                          : 'border-[#2e67b1] bg-white group-hover:border-[#255694]'
                      }`}
                    >
                      {isSelected && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <span className="font-urbanist text-[18px] font-medium text-[#0f172a] capitalize">
                      {subj}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Add Custom Subject Toggle */}
        {section && (
          <>
            {showAddCustomSubject ? (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="Enter custom subject name..."
                  className="flex-1 h-[42px] bg-white border border-[#2e67b1] rounded-[8px] px-4 text-base font-urbanist focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onAddCustomSubject}
                  className="h-[42px] px-4 bg-[#2e67b1] hover:bg-[#255694] text-white text-base font-urbanist font-medium rounded-[8px] transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomSubject(false)}
                  className="h-[42px] px-3 border border-[#d8dee8] text-[#475569] text-base font-urbanist font-medium rounded-[8px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCustomSubject(true)}
                className="flex items-center gap-2 text-[#2e67b1] font-medium font-urbanist text-base hover:underline pt-1 cursor-pointer"
              >
                <Plus className="size-4" />
                Add Another Subject
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
