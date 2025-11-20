// components/DeleteConfirmModal.tsx
"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scheduleName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  scheduleName,
  onConfirm,
  loading,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-red-600 mb-4">Xác nhận xóa</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Bạn có chắc muốn <strong className="text-red-600">xóa vĩnh viễn</strong> lịch trình:
          <br />
          <span className="block mt-2 text-lg font-semibold">“{scheduleName}”</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">Hành động này không thể hoàn tác.</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa vĩnh viễn"}
          </button>
        </div>
      </div>
    </div>
  );
}