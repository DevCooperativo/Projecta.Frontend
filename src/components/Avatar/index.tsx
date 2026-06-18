interface AvatarProps {
    name: string;
    variant: 'professor' | 'student' | 'admin';
    size?: 'sm' | 'md';
}

const VARIANT_CLS: Record<string, string> = {
    professor: 'bg-secondary-subtle text-secondary',
    student: 'bg-primary-subtle text-primary',
    admin: 'bg-dark text-white',
};

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar = ({ name, variant, size = 'sm' }: AvatarProps) => {
    const dim = size === 'md' ? 64 : 40;
    const fs = size === 'md' ? 'fs-4' : 'fs-6';
    return (
        <div
            className={`rounded-circle d-flex align-items-center justify-content-center fw-semibold ${fs} ${VARIANT_CLS[variant]}`}
            style={{ width: dim, height: dim, flexShrink: 0 }}
        >
            {initials(name)}
        </div>
    );
};
