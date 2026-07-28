import React, { useState, useRef } from 'react'
import {
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBulkUploadTeachers } from '../api/useBulkUploadTeachers'

interface TeacherBulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TeacherBulkUploadModal: React.FC<TeacherBulkUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [parsedValidationErrors, setParsedValidationErrors] = useState<
    { row: number; errors: string[] }[]
  >([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const bulkUploadMutation = useBulkUploadTeachers()

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null)
    setParsedValidationErrors([])
    setSuccessMessage(null)

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setErrorMessage('Invalid file type. Please upload a valid .csv file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the maximum limit of 5MB.')
      return
    }

    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setErrorMessage(null)
    setParsedValidationErrors([])
    setSuccessMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownloadSampleCSV = () => {
    const csvContent =
      `full_name,email,cnic_number,dob,gender,phone_number,registration_no,department_name,designation,joining_date,monthly_salary,class_name,section_name\n` +
      `Tariq Mahmood,tariq@example.com,42101-1234567-1,1985-04-12,Male,+92 300 1234567,,Mathematics,Senior Teacher,2022-01-15,75000,Grade 10,x\n` +
      `Sobia Khan,sobia@example.com,42101-7654321-2,1990-09-20,Female,+92 321 9876543,,Science,Lecturer,2023-03-01,65000,Grade 10,y`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'teachers_bulk_upload_sample.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleUploadSubmit = () => {
    if (!selectedFile) return
    setErrorMessage(null)
    setParsedValidationErrors([])
    setSuccessMessage(null)

    bulkUploadMutation.mutate(selectedFile, {
      onSuccess: (data: any) => {
        const payload = data?.data || data
        const successCount = payload?.success_count ?? payload?.insertedCount ?? 'all'
        const failedCount = payload?.failed_count ?? 0
        const failedRecords = payload?.failed_records || []

        if (failedRecords.length > 0) {
          const mappedErrors = failedRecords.map((item: any) => ({
            row: item.row_number || item.row,
            errors: [item.reason || item.message || 'Validation error'],
          }))
          setParsedValidationErrors(mappedErrors)
          setErrorMessage(
            `Imported ${successCount} teacher(s). ${failedCount} row(s) failed validation.`
          )
        } else {
          setSuccessMessage(`Successfully imported ${successCount} teacher record(s) into directory!`)
          setTimeout(() => {
            handleRemoveFile()
            onClose()
          }, 1800)
        }
      },
      onError: (err: any) => {
        const resData = err?.response?.data
        const rawMessage = resData?.message || err?.message || 'Failed to upload CSV file.'

        if (resData?.failed_records && Array.isArray(resData.failed_records)) {
          const mappedErrors = resData.failed_records.map((item: any) => ({
            row: item.row_number || item.row,
            errors: [item.reason || item.message || 'Validation error'],
          }))
          setParsedValidationErrors(mappedErrors)
          setErrorMessage('CSV contains row validation errors. Please review and fix them.')
        } else if (resData?.errors && Array.isArray(resData.errors)) {
          setParsedValidationErrors(resData.errors)
          setErrorMessage('Validation failed for uploaded CSV.')
        } else {
          setErrorMessage(rawMessage)
        }
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#d8dee8] rounded-[16px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2e67b1]/10 rounded-xl text-[#2e67b1]">
              <FileSpreadsheet className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0f172a] font-urbanist">
                Bulk Import Teachers
              </h2>
              <p className="text-sm text-[#475569] font-sans">
                Upload a CSV file to onboard multiple faculty members at once.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Action Sample Bar */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[#2e67b1] shrink-0" />
              <div className="text-xs md:text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Need the correct format?</span>
                <p>Download our sample CSV template with exact teacher column headers.</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSampleCSV}
              leftIcon={<Download className="size-4 text-[#2e67b1]" />}
              className="bg-white text-[#2e67b1] border-blue-200 hover:bg-blue-50 text-xs shrink-0 cursor-pointer"
            >
              Sample CSV
            </Button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-sans space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5 font-semibold">
                <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>

              {parsedValidationErrors.length > 0 && (
                <div className="mt-2 space-y-1 max-h-36 overflow-y-auto pl-7 text-xs border-t border-red-200/60 pt-2">
                  {parsedValidationErrors.map((item, idx) => (
                    <div key={idx} className="text-red-800">
                      <span className="font-bold">Row {item.row}:</span>{' '}
                      {Array.isArray(item.errors) ? item.errors.join(', ') : String(item.errors)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-sans flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-[#2e67b1] bg-[#2e67b1]/5 scale-[0.99]'
                  : 'border-slate-300 hover:border-[#2e67b1] bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="size-14 rounded-full bg-[#2e67b1]/10 text-[#2e67b1] flex items-center justify-center">
                <Upload className="size-7" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800 font-urbanist">
                  Click to upload or drag & drop CSV file
                </p>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  CSV format only. Maximum file size up to 5MB.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <FileSpreadsheet className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!selectedFile || bulkUploadMutation.isPending}
            onClick={handleUploadSubmit}
            leftIcon={
              bulkUploadMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )
            }
          >
            {bulkUploadMutation.isPending ? 'Uploading...' : 'Upload & Import'}
          </Button>
        </div>
      </div>
    </div>
  )
}
