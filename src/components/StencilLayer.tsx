'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export interface StencilProps {
    id: string;
    type: 'navbar' | 'button' | 'card' | 'input' | 'image' | 'text';
    label: string;
    style?: React.CSSProperties;
}

export function DraggableStencil({ id, type, label, style }: StencilProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { type, label },
    });

    const transformStyle = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    const getStylesByType = () => {
        switch (type) {
            case 'navbar': return 'w-full h-12 bg-gray-200 border border-gray-400 flex items-center px-4 rounded';
            case 'button': return 'px-4 py-2 bg-blue-500 text-white rounded text-sm';
            case 'card': return 'w-48 h-64 bg-white border border-gray-300 shadow-sm rounded p-2';
            case 'input': return 'w-48 h-10 border border-gray-300 rounded px-2 bg-white';
            case 'image': return 'w-32 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 rounded';
            case 'text': return 'text-black font-sans';
            default: return 'bg-gray-200 p-2 border';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={{ ...style, ...transformStyle }}
            {...listeners}
            {...attributes}
            className={`absolute cursor-move select-none ${getStylesByType()}`}
        >
            {type === 'image' ? (
                <span>IMG</span>
            ) : (
                <span>{label}</span>
            )}
        </div>
    );
}
