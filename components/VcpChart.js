
import React from 'react';
import { ComposedChart, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const e = React.createElement;
const { useMemo } = React;

const Candlestick = (props) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;

    if (height <= 0 || !isFinite(height)) {
        return null; // Don't render if height is invalid
    }

    const isGrowing = close >= open;
    const color = isGrowing ? '#16a34a' : '#dc2626';
    
    const bodyWidth = Math.max(2, width * 0.8);
    const bodyX = x + (width - bodyWidth) / 2;
    
    const wickX = x + width / 2;
    
    const priceRange = high - low;
    if (priceRange <= 0) { // Handle case with no price movement
        return e('g', null, e('line', {
            x1: bodyX, y1: y,
            x2: bodyX + bodyWidth, y2: y,
            stroke: color, strokeWidth: 1.5,
        }));
    }

    const bodyY = isGrowing 
        ? y + (height * (high - close)) / priceRange 
        : y + (height * (high - open)) / priceRange;
        
    const bodyHeight = Math.max(1, height * Math.abs(open - close) / priceRange);

    return e('g', null,
        // Wick
        e('line', {
            x1: wickX, y1: y,
            x2: wickX, y2: y + height,
            stroke: color, strokeWidth: 1.5,
        }),
        // Body
        e('rect', {
            x: bodyX,
            y: bodyY,
            width: bodyWidth,
            height: bodyHeight,
            fill: color
        })
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        if (data) {
            const priceColor = data.close >= data.open ? 'text-positive' : 'text-negative';
            return e('div', { className: 'p-3 bg-overlay border border-muted/50 rounded-lg shadow-xl' },
                e('p', { className: 'font-bold text-text mb-2' }, label),
                e('div', { className: `text-sm ${priceColor}`},
                    e('p', null, `Open: ${data.open.toFixed(2)}`),
                    e('p', null, `High: ${data.high.toFixed(2)}`),
                    e('p', null, `Low: ${data.low.toFixed(2)}`),
                    e('p', null, `Close: ${data.close.toFixed(2)}`)
                ),
                e('p', { className: 'text-sm text-subtle mt-1' }, `Volume: ${data.volume.toLocaleString()}`)
            );
        }
    }
    return null;
};

export const VcpChart = ({ data }) => {
    const processedData = useMemo(() => {
        return data.map(d => ({ ...d, priceRange: [d.low, d.high] }));
    }, [data]);

    const priceDomain = useMemo(() => {
        if (processedData.length === 0) return [0, 0];
        const lows = processedData.map(d => d.low);
        const highs = processedData.map(d => d.high);
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        const padding = (max - min) * 0.1;
        return [Math.floor(min - padding), Math.ceil(max + padding)];
    }, [processedData]);

    const syncId = "vcpSync";

    return e('div', { className: 'w-full h-full flex flex-col' },
        e(ResponsiveContainer, { width: "100%", height: "75%" },
            e(ComposedChart, { 
                data: processedData, 
                syncId: syncId,
                margin: { top: 5, right: 20, left: -10, bottom: 0 } 
            },
                e(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(80, 80, 80, 0.5)" }),
                e(XAxis, { dataKey: "name", tick: false, axisLine: false, tickLine: false }),
                e(YAxis, { 
                    orientation: "left", 
                    stroke: "#9ca3af", 
                    tickLine: false, 
                    axisLine: false,
                    domain: priceDomain,
                    name: 'Price',
                }),
                e(Tooltip, { content: e(CustomTooltip), cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }),
                e(Bar, {
                    dataKey: "priceRange",
                    name: 'Price',
                    shape: e(Candlestick),
                    isAnimationActive: false,
                    children: processedData.map((entry, index) => {
                        return e(Cell, { key: `cell-price-${index}`, fill: 'transparent' });
                    })
                })
            )
        ),
        e(ResponsiveContainer, { width: "100%", height: "25%" },
            e(BarChart, { 
                data: processedData, 
                syncId: syncId,
                margin: { top: 15, right: 20, left: -10, bottom: 5 }
            },
                e(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(80, 80, 80, 0.5)" }),
                e(XAxis, { dataKey: "name", stroke: "#9ca3af", tickLine: false, axisLine: false, interval: 9 }),
                e(YAxis, { 
                    orientation: "right", 
                    stroke: "#4b5563", 
                    tickLine: false, 
                    axisLine: false,
                    name: 'Volume'
                }),
                e(Tooltip, { cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }),
                e(Bar, {
                    dataKey: "volume",
                    name: 'Volume',
                    children: processedData.map((entry, index) => e(Cell, { key: `cell-volume-${index}`, fill: entry.close >= entry.open ? 'rgba(22, 163, 74, 0.5)' : 'rgba(220, 38, 38, 0.5)' }))
                })
            )
        )
    );
};
