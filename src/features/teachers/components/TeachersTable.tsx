import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Shield } from 'lucide-react'
import type { TeacherItem } from '../types'

interface TeachersTableProps {
  data: TeacherItem[]
  onView?: (teacher: TeacherItem) => void
}

const columnHelper = createColumnHelper<TeacherItem>()

export const TeachersTable: React.FC<TeachersTableProps> = ({
  data,
  onView,
}) => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Faculty Member',
        cell: (info) => {
          const row = info.row.original
          const name = row.full_name || 'Teacher'
          const email = row.email || 'N/A'
          const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()

          return (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary font-urbanist text-sm shrink-0">
                {initials}
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-navy-main text-base font-urbanist leading-tight">
                  {name}
                </p>
                <p className="text-xs text-slate-500 font-sans">{email}</p>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor('employee_id', {
        header: 'Employee ID',
        cell: (info) => {
          const empId = info.getValue() || 'N/A'
          return (
            <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-700">
              {empId}
            </span>
          )
        },
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: (info) => {
          const dept = info.getValue() || 'General'
          return (
            <span className="text-slate-body text-base font-sans font-medium">
              {dept}
            </span>
          )
        },
      }),
      columnHelper.accessor('teacher_leader', {
        header: 'Class Leader',
        cell: (info) => {
          const leader = info.getValue()
          if (!leader) {
            return <span className="text-slate-400 text-sm font-sans">—</span>
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-brand-primary rounded-full text-xs font-semibold font-urbanist">
              <Shield className="size-3" />
              {leader}
            </span>
          )
        },
      }),
      columnHelper.accessor('assigned_classes', {
        header: 'Assigned Classes',
        cell: (info) => {
          const classes = info.getValue() || []
          if (classes.length === 0) {
            return <span className="text-slate-400 text-sm font-sans">—</span>
          }
          return (
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {classes.slice(0, 2).map((cls, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium font-sans"
                >
                  {cls}
                </span>
              ))}
              {classes.length > 2 && (
                <span className="px-2 py-0.5 bg-slate-200/80 text-slate-800 rounded text-xs font-bold font-sans">
                  +{classes.length - 2} more
                </span>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const statusVal = info.getValue() || 'Not Marked'
          const lower = statusVal.toLowerCase()

          let colorStyles = 'bg-slate-100 text-slate-600 border-slate-200'
          if (lower === 'present') {
            colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200'
          } else if (lower === 'absent') {
            colorStyles = 'bg-rose-50 text-rose-700 border-rose-200'
          } else if (lower === 'on leave' || lower === 'leave') {
            colorStyles = 'bg-amber-50 text-amber-700 border-amber-200'
          }

          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-urbanist border ${colorStyles}`}
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
          <div className="flex items-center justify-center">
            <button
              onClick={() => onView?.(info.row.original)}
              className="p-2 text-slate-500 hover:text-brand-primary transition-colors rounded-lg hover:bg-slate-100 cursor-pointer"
              title="View Teacher Profile"
            >
              <Eye className="size-4" />
            </button>
          </div>
        ),
      }),
    ],
    [onView]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white border border-card-border rounded-[8px] overflow-x-auto shadow-xs">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-slate-50 border-b border-card-border"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3.5 text-base font-medium text-slate-800 font-urbanist capitalize"
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
        <tbody className="divide-y divide-card-border">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3.5 align-middle font-normal text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-slate-400 font-urbanist text-lg"
              >
                No faculty members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
