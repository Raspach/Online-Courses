// Модалка общего назначения — используем для подтверждения удаления
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div>{children}</div>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          ✕
        </button>
      </div>
    </div>
  );
}

export function ConfirmDeleteModal({ open, onClose, onConfirm, itemName }) {
  return (
    <Modal open={open} onClose={onClose} title="Подтвердите удаление">
      <p className="text-slate-600">
        Удалить «{itemName}»? Это действие нельзя отменить.
      </p>
      <div className="flex gap-2 justify-end mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300">
          Отмена
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
          Удалить
        </button>
      </div>
    </Modal>
  );
}
