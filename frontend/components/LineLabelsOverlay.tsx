import React from 'react';
import { LabelData } from './TimeSeriesChart';

type LineLabelsOverlayProps = {
  labelData: LabelData[];
  chartMargin: { top: number; right: number; bottom: number; left: number };
};

// This component takes the calculated label positions and renders them as an HTML overlay
export const LineLabelsOverlay = ({ labelData, chartMargin }: LineLabelsOverlayProps) => {
  if (!labelData || labelData.length === 0) {
    return null;
  }

  // 1. Sort points by their y-coordinate to prepare for collision detection
  const sortedPoints = [...labelData].sort((a, b) => a.y - b.y);

  const labels: Array<{ key: string; y: number; color: string; originalY: number; originalX: number }> = [];
  const labelHeight = 18; // The approximate height of each label

  // 2. Position labels and avoid overlaps (dodging)
  sortedPoints.forEach((point, i) => {
    let targetY = point.y;

    if (i > 0) {
      const prevLabel = labels[i - 1];
      if (targetY < prevLabel.y + labelHeight) {
        targetY = prevLabel.y + labelHeight;
      }
    }

    labels.push({
      key: point.key,
      y: targetY,
      color: point.color,
      originalY: point.y,
      originalX: point.x
    });
  });

  // Since all labels are right-aligned, we can use the x position of the first one
  // and add a small margin for all of them.
  const labelStartX = sortedPoints[0].x + 10;

  return (
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{
        paddingTop: `${chartMargin.top}px`,
        paddingLeft: `${chartMargin.left}px`,
      }}
    >
      {labels.map((label) => {
        return (
          <React.Fragment key={label.key}>
            {/* Connector Line rendered in an SVG overlay */}
            <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
              <line
                x1={label.originalX}
                y1={label.originalY}
                x2={labelStartX - 5}
                y2={label.y}
                stroke="#ccc"
                strokeWidth={1}
              />
            </svg>
            {/* Label Text rendered as a DIV */}
            <div
              style={{
                position: 'absolute',
                top: `${label.y}px`,
                left: `${labelStartX}px`,
                transform: 'translateY(-50%)',
                color: label.color,
                fontSize: '12px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {label.key}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}; 