interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({ show, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }: ConfirmModalProps) => {
    if (!show) return null;
    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onCancel} aria-label="Fechar" />
                        </div>
                        <div className="modal-body">{message}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={onConfirm}>
                                {confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1050 }}
                onClick={onCancel}
            />
        </>
    );
};
