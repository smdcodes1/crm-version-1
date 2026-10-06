import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import "./Modal.css";
export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg', }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsAnimating(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 180);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    // Handle escape key and body scroll lock
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    if (!shouldRender) return null;
    
    const modalContent = (
        <div className='crm-modal-root'>
            {/* Backdrop */}
            <div
                className={`crm-modal-backdrop ${isAnimating ? 'crm-active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div
                role="dialog"
                aria-modal="true"
                className={`crm-modal-card crm-modal-${maxWidth} ${isAnimating ? 'crm-active' : ''}`}
            >
                {/* Header */}
                <div className="crm-modal-header">
                    <div className="crm-modal-title-group">
                        {title && <h3 className="crm-modal-title">{title}</h3>}
                        {subtitle && <p className="crm-modal-subtitle">{subtitle}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="crm-modal-close-btn"
                        aria-label="Close dialog"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="crm-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}


