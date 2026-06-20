import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { researcherSchema, type ResearcherValues } from '@/schemas/researchers/researcherSchema';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';
import type { StudentResponse } from '@/api/students/iStudentsServices';

export interface AddResearcherResult {
    personType: 'professor' | 'student';
    personId: number;
    personName: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
}

interface AddResearcherModalProps {
    show: boolean;
    onClose: () => void;
    onAdd: (data: AddResearcherResult) => void;
}

export const AddResearcherModal = ({ show, onClose, onAdd }: AddResearcherModalProps) => {
    const [professors, setProfessors] = useState<ProfessorResponse[]>([]);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [selectedName, setSelectedName] = useState('');

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ResearcherValues>({
        resolver: yupResolver(researcherSchema),
        defaultValues: { personType: 'professor' },
    });

    const personType = watch('personType') as 'professor' | 'student';
    const personId = watch('personId');

    useEffect(() => {
        if (show) {
            professorsServices.list().then(x => x.data && setProfessors(x.data)).catch(() => setProfessors([]));
            studentsServices.list().then(x => x.data && setStudents(x.data)).catch(() => setStudents([]));
        }
    }, [show]);

    useEffect(() => {
        setValue('personId', 0 as unknown as number);
        setSelectedName('');
    }, [personType, setValue]);

    useEffect(() => {
        if (!personId) { setSelectedName(''); return; }
        if (personType === 'professor') {
            const p = professors.find(x => x.id === Number(personId));
            setSelectedName(p?.name ?? '');
        } else {
            const s = students.find(x => x.id === Number(personId));
            setSelectedName(s?.name ?? '');
        }
    }, [personId, personType, professors, students]);

    const onSubmit = (data: ResearcherValues) => {
        onAdd({
            personType: data.personType as 'professor' | 'student',
            personId: data.personId,
            personName: selectedName,
            functionName: data.functionName,
            weeklyHours: data.weeklyHours,
            startDate: data.startDate,
            endDate: data.endDate || undefined,
        });
        reset({ personType: 'professor' });
        setSelectedName('');
    };

    const handleClose = () => {
        reset({ personType: 'professor' });
        setSelectedName('');
        onClose();
    };

    if (!show) return null;

    const personOptions = personType === 'professor' ? professors : students;

    return (
        <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ zIndex: 1055 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adicionar pesquisador</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Fechar" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Tipo</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input
                                                {...register('personType')}
                                                className="form-check-input"
                                                type="radio"
                                                value="professor"
                                                id="type-professor"
                                            />
                                            <label className="form-check-label" htmlFor="type-professor">Professor</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                {...register('personType')}
                                                className="form-check-input"
                                                type="radio"
                                                value="student"
                                                id="type-student"
                                            />
                                            <label className="form-check-label" htmlFor="type-student">Aluno</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="res-personId">
                                        {personType === 'professor' ? 'Professor' : 'Aluno'}
                                    </label>
                                    <select
                                        {...register('personId', { valueAsNumber: true })}
                                        id="res-personId"
                                        className={`form-select ${errors.personId ? 'is-invalid' : ''}`}
                                    >
                                        <option value="">Selecione...</option>
                                        {personOptions.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {errors.personId && <div className="invalid-feedback">{errors.personId.message}</div>}
                                </div>

                                {selectedName && (
                                    <div className="alert alert-light border mb-3 py-2">
                                        <p className="fw-semibold mb-0 small">{selectedName}</p>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="res-functionName">Função no projeto</label>
                                    <input
                                        {...register('functionName')}
                                        id="res-functionName"
                                        type="text"
                                        className={`form-control ${errors.functionName ? 'is-invalid' : ''}`}
                                    />
                                    {errors.functionName && <div className="invalid-feedback">{errors.functionName.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="res-weeklyHours">Horas semanais</label>
                                    <input
                                        {...register('weeklyHours', { valueAsNumber: true })}
                                        id="res-weeklyHours"
                                        type="number"
                                        min={1}
                                        max={44}
                                        className={`form-control ${errors.weeklyHours ? 'is-invalid' : ''}`}
                                    />
                                    {errors.weeklyHours && <div className="invalid-feedback">{errors.weeklyHours.message}</div>}
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="res-startDate">Data de início</label>
                                        <input
                                            {...register('startDate')}
                                            id="res-startDate"
                                            type="date"
                                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.startDate && <div className="invalid-feedback">{errors.startDate.message}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label" htmlFor="res-endDate">Data de término <span className="text-muted">(opcional)</span></label>
                                        <input
                                            {...register('endDate')}
                                            id="res-endDate"
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
