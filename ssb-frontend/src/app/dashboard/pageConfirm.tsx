"use client";
import React from "react";

interface LogoutConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmModal({
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-80 p-6 rounded-xl shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Xác nhận đăng xuất
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Bạn có chắc chắn muốn đăng xuất?
        </p>

        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
