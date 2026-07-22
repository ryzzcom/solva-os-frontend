import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Upload, ChevronRight, Users, Info } from 'lucide-react'
import { useStudents } from '../api/useStudents'
import { StudentsFilterBar } from '../components/StudentsFilterBar'
import { StudentsTable } from '../components/StudentsTable'
import { StudentsPagination } from '../components/StudentsPagination'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricCard } from '@/components/ui/MetricCard'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'

export default function StudentsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showNotice, setShowNotice] = useState(false)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const initialSearch = searchParams.get('search') || ''
  const initialClassId = searchParams.get('class_id') || ''
  const initialSectionId = searchParams.get('section_id') || ''

  const [search, setSearch] = useState(initialSearch)
  const [classId, setClassId] = useState(initialClassId)
  const [sectionId, setSectionId] = useState(initialSectionId)

  const debouncedSearch = useDebounce(search, 400)

  // Auto-sync debounced search input with URL searchParams
  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      setSearchParams({
        page: '1',
        limit: limit.toString(),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(classId ? { class_id: classId } : {}),
        ...(sectionId ? { section_id: sectionId } : {}),
      })
    }
  }, [debouncedSearch])

  const { data, isLoading, isError, error } = useStudents({
    page,
    limit,
    search: initialSearch,
    class_id: initialClassId,
    section_id: initialSectionId,
  })

  const handleApplyFilters = () => {
    setSearchParams({
      page: '1',
      limit: limit.toString(),
      ...(search ? { search } : {}),
      ...(classId ? { class_id: classId } : {}),
      ...(sectionId ? { section_id: sectionId } : {}),
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
      ...(classId ? { class_id: classId } : {}),
      ...(sectionId ? { section_id: sectionId } : {}),
    })
  }

  const studentsList = data?.students || []
  const totalCount = data?.totalCount || 0
  const totalPages = Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* Notice Banner */}
      {showNotice && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <Info className="size-5 text-[#2e67b1] shrink-0" />
            <p className="font-urbanist text-base font-medium">
              Student Registration form modal will open here once the form flow is connected.
            </p>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-blue-600 hover:text-blue-900 font-bold text-sm underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-base">
        <span className="text-[#475569] font-sans font-normal">Principal Dashboard.</span>
        <ChevronRight className="size-4 text-[#475569]" />
        <span className="text-[#0f172a] font-urbanist font-medium capitalize">Students</span>
      </div>

      {/* 2. Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0f172a] font-urbanist leading-[40px]">
            Students Directory
          </h1>
          <p className="text-[#334155] text-base font-normal font-sans leading-[24px]">
            Manage all enrolled students across classes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          <Button
            onClick={() => navigate('/students/add')}
            variant="primary"
            leftIcon={<Plus className="size-5" />}
          >
            Add New student
          </Button>
          <Button
            onClick={() => setShowNotice(true)}
            variant="outline"
            leftIcon={<Upload className="size-5" />}
          >
            Import CSV
          </Button>
        </div>
      </div>

      {/* 3. Total Students Banner Card - Using Reusable MetricCard */}
      <MetricCard
        value={isLoading ? '...' : totalCount}
        label="Total Students"
        gradientClass="from-[#2e67b1] to-[#4f8edc] border border-[#2e67b1] shadow-blue-600/15"
        iconColorClass="text-[#2e67b1]"
        icon={Users}
      />

      {/* 4. Filter & Search Bar */}
      <StudentsFilterBar
        search={search}
        onSearchChange={setSearch}
        classId={classId}
        onClassIdChange={setClassId}
        sectionId={sectionId}
        onSectionIdChange={setSectionId}
        onApplyFilters={handleApplyFilters}
      />

      {/* 5. Data Table Section */}
      {isLoading ? (
        <div className="bg-white border border-[#d8dee8] rounded-[8px] p-6 space-y-4 shadow-xs">
          <Skeleton className="h-10 w-full rounded-md bg-slate-200" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md bg-slate-150" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-urbanist">
          <p className="font-semibold">Failed to fetch students directory</p>
          <p className="text-sm mt-1">{error?.message || 'Could not connect to server.'}</p>
        </div>
      ) : (
        <>
          <StudentsTable
            data={studentsList}
            onView={(student) => console.log('View student', student)}
            onEdit={(student) => console.log('Edit student', student)}
            onDelete={(student) => console.log('Delete student', student)}
          />

          {/* 6. Pagination Bar */}
          <StudentsPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            currentCount={studentsList.length}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
