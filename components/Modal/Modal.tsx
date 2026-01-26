'use client';

import css from './Modal.module.css';
import { useEffect } from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    
    useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';

    return () => {
        document.removeEventListener('keydown', handleKeydown);
        document.body.style.overflow = '';
    };
}, [onClose]);

const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
) => {
    if (e.target === e.currentTarget) onClose();
};

return (
        <div
            onClick={handleBackdropClick}
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
        >
        <div className={css.modal}>{children}</div>
    </div>
    );
}
