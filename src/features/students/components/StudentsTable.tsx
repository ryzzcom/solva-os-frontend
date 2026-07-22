import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Edit2, Trash2 } from 'lucide-react'
import type { StudentItem } from '../types'

interface StudentsTableProps {
  data: StudentItem[]
  onView?: (student: StudentItem) => void
  onEdit?: (student: StudentItem) => void
  onDelete?: (student: StudentItem) => void
}

const columnHelper = createColumnHelper<StudentItem>()

export const StudentsTable: React.FC<StudentsTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Student Name',
        cell: (info) => {
          const row = info.row.original
          const studentName = row.name || row.full_name || 'Student'
          return (
            <span className="font-medium text-[#0f172a] text-base font-urbanist">
              {studentName}
            </span>
          )
        },
      }),
      columnHelper.accessor('roll_no', {
        header: 'Roll No.',
        cell: (info) => {
          const row = info.row.original
          const roll = row.rollNo || row.roll_no || 'N/A'
          return (
            <span className="text-[#334155] text-base font-sans font-medium">
              {roll}
            </span>
          )
        },
      }),
      columnHelper.accessor('class_name', {
        header: 'Class & Section',
        cell: (info) => {
          const row = info.row.original
          const classSec =
            row.classSection ||
            (row.class_name && row.section_name
              ? `${row.class_name} (${row.section_name})`
              : 'N/A')
          return (
            <span className="text-[#334155] text-base font-sans">
              {classSec}
            </span>
          )
        },
      }),
      columnHelper.accessor('father_phone', {
        header: 'Parent Contact',
        cell: (info) => {
          const row = info.row.original
          const contact = row.parentContact || row.father_phone || 'N/A'
          return (
            <span className="text-[#334155] text-base font-sans">
              {contact}
            </span>
          )
        },
      }),
      columnHelper.accessor('attendancePercentage', {
        header: 'Attendance',
        cell: (info) => {
          const val = info.getValue() ?? 100
          let barBg = 'bg-[#22c55e]'
          if (val < 50) barBg = 'bg-[#dc2626]'
          else if (val < 75) barBg = 'bg-[#eab308]'

          return (
            <div className="flex items-center gap-2">
              <div className="bg-[#e5e7eb] h-3.5 w-16 md:w-20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barBg} rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                />
              </div>
              <span className="text-[#4b5563] text-sm md:text-base font-sans">
                {val}%
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const statusVal = info.getValue()
          const isPaid = statusVal?.toLowerCase() === 'paid' || statusVal?.toLowerCase() === 'active'

          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-sans ${
                isPaid
                  ? 'bg-[#dcfce7] text-[#16a34a]'
                  : 'bg-[#fee2e2] text-[#dc2626]'
              }`}
            >
              {statusVal}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onView?.(info.row.original)}
              className="p-1.5 text-slate-500 hover:text-[#2e67b1] transition-colors rounded-lg hover:bg-slate-100"
              title="View Student"
            >
              <Eye className="size-4" />
            </button>
            <button
              onClick={() => onEdit?.(info.row.original)}
              className="p-1.5 text-slate-500 hover:text-amber-600 transition-colors rounded-lg hover:bg-slate-100"
              title="Edit Student"
            >
              <Edit2 className="size-4" />
            </button>
            <button
              onClick={() => onDelete?.(info.row.original)}
              className="p-1.5 text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
              title="Delete Student"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      }),
    ],
    [onView, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white border border-[#d8dee8] rounded-[8px] overflow-x-auto shadow-xs">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-[#f9fafb] border-b border-[#d8dee8]"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3.5 text-base font-medium text-[#1e293b] font-urbanist capitalize"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[#d8dee8]">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <th
                    key={cell.id}
                    className="px-4 py-3.5 align-middle font-normal"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </th>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-slate-400 font-urbanist text-lg"
              >
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
