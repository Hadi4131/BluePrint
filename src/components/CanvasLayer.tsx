'use client';

import * as React from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

interface CanvasLayerProps {
    onExport: (data: string) => void;
    className?: string;
    canvasRef: React.RefObject<ReactSketchCanvasRef>;
}

export function CanvasLayer({ onExport, className, canvasRef, strokeColor = "black", strokeWidth = 4 }: any) {
    return (
        <div className={`w-full h-full bg-white relative ${className}`}>
            <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
                canvasColor="transparent"
                className="w-full h-full cursor-crosshair"
            />
        </div>
    );
}
