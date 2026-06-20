import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { coordinatorSchema, type CoordinatorValues } from '@/schemas/coordinators/coordinatorSchema';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';

export interface AddCoordinatorResult {
    professorId: number;
    professorName: string;
    professorEmail: string;
    area: string;
    startDate: string;
    endDate?: string;
}

interface AddCoordinatorModalProps {
    show: boolean;
    onClose: () => void;
    onAdd: (data: AddCoordinatorResult) => void;
}

export const AddCoordinatorModal = ({ show, onClose, onAdd }: AddCoordinatorModalProps) => {
    const [professors, setProfessors] = useState<ProfessorResponse[]>([]);
    const [selectedProfessor, setSelectedProfessor] = useState<ProfessorResponse | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CoordinatorValues>({
        resolver: yupResolver(coordinatorSchema),
    });

    const watchedProfessorId = watch('professorId');

    useEffect(() => {
        if (show) {
            professorsServices.list()
                .then(x => x.data && setProfessors(x.data))
                .catch(() => setProfessors([]));
        }
    }, [show]);

    useEffect(() => {
        const p = professors.find(x => x.id === Number(watchedProfessorId));
        setSelectedProfessor(p ?? null);
    }, [watchedProfessorId, professors]);

    const onSubmit = (data: CoordinatorValues) => {
        if (!selectedProfessor) return;
        onAdd({
            professorId: data.professorId,
            professorName: selectedProfessor.name,
            professorEmail: selectedProfessor.email,
            area: data.area,
            startDate: data.startDate,
            endDate: data.endDate || undefined,
        });
        reset();
        setSelectedProfessor(null);
    };

    const handleClose = () => {
        reset();
        setSelectedProfessor(null);
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adicionar coordenador</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Fechar" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="coord-professorId">Professor</label>
                                    <select
                                        {...register('professorId', { valueAsNumber: true })}
                                        id="coord-professorId"
                                        className={`form-select ${errors.professorId ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Selecione um professor...</option>
                                        {professors.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.professorId && <div className="invalid-feedback">{errors.professorId.message}</div>}
                                </div>

                                {selectedProfessor && (
                                    <div className="alert alert-light border mb-3 py-2">
                                        <p className="fw-semibold mb-0 small">{selectedProfessor.name}</p>
                                        <p className="text-muted mb-0 small">{selectedProfessor.email}</p>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="coord-area">Área de atuação</label>
                                    <input
                                        {...register('area')}
                                        id="coord-area"
                                        type="text"
                                        className={`form-control ${errors.area ? 'is-invalid' : ''}`}
                                    />
                                    {errors.area && <div className="invalid-feedback">{errors.area.message}</div>}
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="coord-startDate">Data de início</label>
                                        <input
                                            {...register('startDate')}
                                            id="coord-startDate"
                                            type="date"
                                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.startDate && <div className="invalid-feedback">{errors.startDate.message}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="coord-endDate">Data de término <span className="text-muted">(opcional)</span></label>
                                        <input
                                            {...register('endDate')}
                                            id="coord-endDate"
                                            type="date"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-dark">
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={handleClose} />
        </>
    );
};
