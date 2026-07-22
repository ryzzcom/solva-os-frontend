import React, { useEffect } from 'react'
import { UserPlus } from 'lucide-react'

interface StudentProfilePhotoUploadProps {
  photoPreview: string | null
  onPhotoSelect: (file: File) => void
}

export const StudentProfilePhotoUpload: React.FC<StudentProfilePhotoUploadProps> = ({
  photoPreview,
  onPhotoSelect,
}) => {
  // Clean up Object URL when component unmounts or image changes to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoSelect(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white border border-[#d8dee8] rounded-[12px]">
      <label className="relative size-[100px] rounded-full border-2 border-dashed border-[#2e67b1] flex flex-col items-center justify-center cursor-pointer hover:border-[#255694] transition-colors bg-[#f8fafc] overflow-hidden group shrink-0">
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Student preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <UserPlus className="size-8 text-[#2e67b1] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-[#2e67b1] font-medium font-urbanist mt-1">
              Upload Photo
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="space-y-1">
        <h3 className="text-[18px] font-medium font-urbanist text-[#0f172a] capitalize">
          Profile Picture
        </h3>
        <p className="text-[#334155] text-sm font-sans leading-[20px] max-w-sm">
          Upload a clear, recent photo. Drag & drop supported. Max size 2MB.
        </p>
      </div>
    </div>
  )
}
