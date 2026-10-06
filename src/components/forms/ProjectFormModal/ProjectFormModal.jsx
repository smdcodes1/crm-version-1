import React, { useState, useEffect } from 'react';
import { useCRM } from '../../../context/CRMContext';
import {Modal} from "../../Modal/Modal";
import "./ProjectFormModal.css";
const PROJECT_STATUSES = [
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
  'Not Started',
];
function ProjectFormModal({ isOpen, onClose, projectToEdit, defaultCustomerId }) {
    const { customers, addProject, updateProject } = useCRM();
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [deadline, setDeadline] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });
    const [status, setStatus] = useState('In Progress');
    const [progress, setProgress] = useState(20);
    const [projectValue, setProjectValue] = useState(50000);
    const [assignedTo, setAssignedTo] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});

    const handleCustomerChange = (selectedCustId) => {
        setCustomerId(selectedCustId);
        const found = customers.find((c) => c.id === selectedCustId);
        if (found) {
            setCustomerName(found.companyName);
        }
    };
    useEffect(() => {
        if (projectToEdit) {
            setCustomerId(projectToEdit.customerId || '');
            setCustomerName(projectToEdit.customerName || '');
            setProjectName(projectToEdit.projectName || '');
            setDescription(projectToEdit.description || '');
            setStartDate(projectToEdit.startDate || new Date().toISOString().split('T')[0]);
            setDeadline(projectToEdit.deadline || new Date().toISOString().split('T')[0]);
            setStatus(projectToEdit.status || 'In Progress');
            setProgress(projectToEdit.progress ?? 0);
            setProjectValue(projectToEdit.projectValue ?? 0);
            setAssignedTo(projectToEdit.assignedTo || '');
            setNotes(projectToEdit.notes || '');
        } else {
            if (defaultCustomerId) {
                handleCustomerChange(defaultCustomerId);
            } else if (customers.length > 0) {
                handleCustomerChange(customers[0].id);
            } else {
                setCustomerId('');
                setCustomerName('');
            }
            setProjectName('');
            setDescription('');
            setStartDate(new Date().toISOString().split('T')[0]);
            const d = new Date();
            d.setDate(d.getDate() + 30);
            setDeadline(d.toISOString().split('T')[0]);
            setStatus('In Progress');
            setProgress(10);
            setProjectValue(50000);
            setAssignedTo('Alex Morgan');
            setNotes('');
        }
        setErrors({});
    }, [projectToEdit, defaultCustomerId, isOpen, customers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!customerName.trim()) newErrors.customerName = 'Company name is required';
        if (!projectName.trim()) newErrors.projectName = 'Project name is required';
        if (!startDate) newErrors.startDate = 'Start date is required';
        if (!deadline) newErrors.deadline = 'Deadline is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            customerId: customerId || `cust_custom_${Date.now()}`,
            customerName: customerName.trim(),
            projectName: projectName.trim(),
            description: description.trim(),
            startDate,
            deadline,
            status,
            progress: Number(progress) || 0,
            projectValue: Number(projectValue) || 0,
            assignedTo: assignedTo.trim(),
            notes: notes.trim(),
        };

        if (projectToEdit) {
            updateProject(projectToEdit.id, payload);
        } else {
            addProject(payload);
        }

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={projectToEdit ? 'Edit Project' : 'Create Project'}
            subtitle="Track deliverables, milestone progress, and team assignments"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit} className="pfm-form">
                <div className="pfm-grid">
                    {/* Customer Select / Input */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-customer-select">
                            Company / Client <span className="pfm-required">*</span>
                        </label>
                        {customers.length > 0 ? (
                            <select
                                id="project-customer-select"
                                value={customerId}
                                onChange={(e) => handleCustomerChange(e.target.value)}
                                className="pfm-select"
                            >
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.companyName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                required
                                placeholder="Company Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="pfm-input"
                            />
                        )}
                        {errors.customerName && (
                            <p className="pfm-error-text">{errors.customerName}</p>
                        )}
                    </div>

                    {/* Project Name Input */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-name-input">
                            Project Name <span className="pfm-required">*</span>
                        </label>
                        <input
                            id="project-name-input"
                            type="text"
                            required
                            placeholder="e.g. Website Development"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="pfm-input"
                        />
                        {errors.projectName && (
                            <p className="pfm-error-text">{errors.projectName}</p>
                        )}
                    </div>

                    {/* Description Input */}
                    <div className="pfm-field pfm-col-span-2">
                        <label className="pfm-label" htmlFor="project-description-input">
                            Description
                        </label>
                        <input
                            id="project-description-input"
                            type="text"
                            placeholder="Key scope deliverables..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="pfm-input"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-start-date-input">
                            Start Date <span className="pfm-required">*</span>
                        </label>
                        <input
                            id="project-start-date-input"
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pfm-input"
                        />
                        {errors.startDate && (
                            <p className="pfm-error-text">{errors.startDate}</p>
                        )}
                    </div>

                    {/* Deadline Date */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-deadline-input">
                            Deadline <span className="pfm-required">*</span>
                        </label>
                        <input
                            id="project-deadline-input"
                            type="date"
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="pfm-input"
                        />
                        {errors.deadline && (
                            <p className="pfm-error-text">{errors.deadline}</p>
                        )}
                    </div>

                    {/* Status Select */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-status-select">
                            Status
                        </label>
                        <select
                            id="project-status-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="pfm-select"
                        >
                            {PROJECT_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Progress Range Slider */}
                    <div className="pfm-field">
                        <label className="pfm-label">
                            Progress ({progress}%)
                        </label>
                        <div className="pfm-range-wrapper">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={progress}
                                onChange={(e) => setProgress(Number(e.target.value))}
                                className="pfm-range-slider"
                            />
                            <span className="pfm-range-value">
                                {progress}%
                            </span>
                        </div>
                    </div>

                    {/* Project Value */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-value-input">
                            Project Value (₹)
                        </label>
                        <input
                            id="project-value-input"
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="e.g. 80000"
                            value={projectValue}
                            onChange={(e) =>
                                setProjectValue(e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="pfm-input"
                        />
                    </div>

                    {/* Assigned To */}
                    <div className="pfm-field">
                        <label className="pfm-label" htmlFor="project-assigned-to-input">
                            Assigned To
                        </label>
                        <input
                            id="project-assigned-to-input"
                            type="text"
                            placeholder="e.g. Alex Morgan"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            className="pfm-input"
                        />
                    </div>
                </div>

                {/* Notes Input */}
                <div className="pfm-field">
                    <label className="pfm-label" htmlFor="project-notes-input">
                        Notes
                    </label>
                    <textarea
                        id="project-notes-input"
                        rows={2}
                        placeholder="Sprint links, repo URLs, staging credentials, or client feedback..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="pfm-textarea"
                    />
                </div>

                {/* Modal Footer Actions */}
                <div className="pfm-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="pfm-btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="save-project-submit-btn"
                        className="pfm-btn-submit"
                    >
                        {projectToEdit ? 'Update Project' : 'Save Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default ProjectFormModal
