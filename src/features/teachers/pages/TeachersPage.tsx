import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Upload, ChevronRight, UserCheck } from 'lucide-react'
import { useTeachers } from '../api/useTeachers'
import { TeachersFilterBar } from '../components/TeachersFilterBar'
import { TeachersTable } from '../components/TeachersTable'
import { TeachersPagination } from '../components/TeachersPagination'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricCard } from '@/components/ui/MetricCard'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'

export default function TeachersPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const initialSearch = searchParams.get('search') || ''
  const initialClassId = searchParams.get('class_id') || ''
  const initialStatus = searchParams.get('status') || ''

  const [search, setSearch] = useState(initialSearch)
  const [classId, setClassId] = useState(initialClassId)
  const [status, setStatus] = useState(initialStatus)

  const debouncedSearch = useDebounce(search, 400)

  // Auto-sync search input with URL searchParams
  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      setSearchParams({
        page: '1',
        limit: limit.toString(),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(classId ? { class_id: classId } : {}),
        ...(status ? { status } : {}),
      })
    }
  }, [debouncedSearch])

  const { data, isLoading, isError, error } = useTeachers({
    page,
    limit,
    search: initialSearch,
    class_id: initialClassId,
    status: initialStatus,
  })

  const handleApplyFilters = () => {
    setSearchParams({
      page: '1',
      limit: limit.toString(),
      ...(search ? { search } : {}),
      ...(classId ? { class_id: classId } : {}),
      ...(status ? { status } : {}),
    })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
      ...(classId ? { class_id: classId } : {}),
      ...(status ? { status } : {}),
    })
  }

  const teachersList = data?.teachers || []
  const totalCount = data?.pagination?.total ?? data?.totalCount ?? 0
  const totalPages = data?.pagination?.totalPages || Math.ceil(totalCount / limit) || 1

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-base">
        <span
          onClick={() => navigate('/dashboard')}
          className="text-slate-sub font-sans font-normal hover:underline cursor-pointer"
        >
          Principal Dashboard.
        </span>
        <ChevronRight className="size-4 text-slate-sub" />
        <span className="text-navy-main font-urbanist font-medium capitalize">Teachers</span>
      </div>

      {/* 2. Header Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-navy-main font-urbanist leading-[40px]">
            Teachers Directory
          </h1>
          <p className="text-slate-body text-base font-normal font-sans leading-[24px]">
            Manage all faculty members, department assignments, and class leadership.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate('/teachers/add')}
            variant="primary"
            leftIcon={<Plus className="size-5" />}
          >
            Onboard Teacher
          </Button>
          <Button
            onClick={() => console.log('Bulk import teachers')}
            variant="outline"
            leftIcon={<Upload className="size-5 text-brand-primary" />}
          >
            Import CSV
          </Button>
        </div>
      </div>

      {/* 3. Metric Card - Reusable Component */}
      <MetricCard
        value={isLoading ? '...' : totalCount}
        label="Total Faculty Members"
        gradientClass="from-brand-primary to-accent-blue border border-brand-primary shadow-blue-600/15"
        iconColorClass="text-brand-primary"
        icon={UserCheck}
      />

      {/* 4. Filter & Search Bar */}
      <TeachersFilterBar
        search={search}
        onSearchChange={setSearch}
        classId={classId}
        onClassIdChange={setClassId}
        status={status}
        onStatusChange={setStatus}
        onApplyFilters={handleApplyFilters}
      />

      {/* 5. Data Table Section */}
      {isLoading ? (
        <div className="bg-white border border-card-border rounded-[8px] p-6 space-y-4 shadow-xs">
          <Skeleton className="h-10 w-full rounded-md bg-slate-200" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md bg-slate-150" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-urbanist">
          <p className="font-semibold">Failed to fetch teachers directory</p>
          <p className="text-sm mt-1">{(error as any)?.message || 'Could not connect to server.'}</p>
        </div>
      ) : (
        <>
          <TeachersTable
            data={teachersList}
            onView={(teacher) => console.log('View teacher profile', teacher.id)}
          />

          {/* 6. Pagination Bar */}
          <TeachersPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            currentCount={teachersList.length}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
