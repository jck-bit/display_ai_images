// src/components/SkeletonImageCard.tsx
import React from 'react';
import './SkeletonImageCard.css';

interface SkeletonImageCardProps {
    aspectRatio?: string; 
}

const SkeletonImageCard: React.FC<SkeletonImageCardProps> = ({ aspectRatio = "128.636%" }) => { 
    return (
        <figure className="relative skeleton-card" style={{ paddingBottom: aspectRatio }}>
            <figure className="relative skeleton-card" style={{ paddingBottom: "128.636%" }}>
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                    <div className="skeleton-shimmer-wrapper">
                        <div className="skeleton-shimmer-effect"></div>
                    </div>
                </div>
                <figcaption className="absolute bottom-0 left-0 w-full p-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 skeleton-shimmer-wrapper">
                        <div className="skeleton-shimmer-effect"></div>
                    </div>
                    <div className="w-full">
                        <div className="h-10 bg-gray-200 rounded-full skeleton-shimmer-wrapper">
                            <div className="skeleton-shimmer-effect"></div>
                        </div>
                    </div>
                </figcaption>
            </figure>
        </figure>
    );
};

export default SkeletonImageCard;