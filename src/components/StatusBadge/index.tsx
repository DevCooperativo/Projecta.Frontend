interface StatusBadgeProps {
    status: string;
}

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
    active: { cls: 'bg-success-subtle text-success border border-success-subtle', label: 'Ativo' },
    inactive: { cls: 'bg-secondary-subtle text-secondary border border-secondary-subtle', label: 'Inativo' },
    pending: { cls: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle', label: 'Pendente' },
    completed: { cls: 'bg-primary-subtle text-primary border border-primary-subtle', label: 'Concluído' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const config = STATUS_MAP[status] ?? { cls: 'bg-secondary-subtle text-secondary', label: status };
    return (
        <span className={`badge fw-normal ${config.cls}`}>
            {config.label}
        </span>
    );
};
