import React, { useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from 'recharts';
import { motion } from 'framer-motion';

// Updated color schemes with better contrast
const COLORS = {
    links: [
        '#3B82F6', // bright blue
        '#EF4444', // red
        '#10B981', // green
        '#F59E0B', // amber
        '#8B5CF6', // purple
        '#EC4899'  // pink
    ],
    users: [
        '#3B82F6', // bright blue
        '#EF4444', // red
        '#10B981', // green
        '#F59E0B'  // amber
    ]
};

const renderActiveShape = (props) => {
    const {
        cx, cy, innerRadius, outerRadius,
        startAngle, endAngle, fill,
        payload, percent, value
    } = props;

    return (
        <g>
            <text
                x={cx}
                y={cy - 10}
                dy={8}
                textAnchor="middle"
                fill="#fff"
                className="text-sm"
            >
                {payload.name}
            </text>
            <text
                x={cx}
                y={cy + 10}
                dy={8}
                textAnchor="middle"
                fill="#fff"
                className="text-lg font-bold"
            >
                {value}
            </text>
            <text
                x={cx}
                y={cy + 30}
                dy={8}
                textAnchor="middle"
                fill="#fff"
                className="text-sm opacity-75"
            >
                {`(${(percent * 100).toFixed(1)}%)`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={innerRadius - 6}
                outerRadius={innerRadius - 2}
                fill={fill}
            />
        </g>
    );
};

const CustomActiveShapePieChart = ({ data, title, type }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const colors = COLORS[type] || COLORS.links;

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/10 rounded-lg 0 p-6"
        >
            <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                    className="opacity-90 hover:opacity-100 transition-opacity"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                    {data.map((entry, index) => (
                        <div
                            key={`legend-${index}`}
                            className="flex items-center space-x-2"
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="text-sm text-gray-300">
                                {entry.name}: {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const DashboardCustomPieCharts = ({ linkStats, userStats }) => {
    if (!linkStats || !userStats) return null;

    const linkVisibilityData = [
        { name: 'Public', value: linkStats.totals.public },
        { name: 'Private', value: linkStats.totals.private }
    ];

    let categoryData = [];
    if (linkStats.categoryStats) {
        categoryData = Object.entries(linkStats.categoryStats).map(([category, stats]) => ({
            name: category || 'Uncategorized',
            value: stats.total
        }));
    }

    let unitData = [];
    if (userStats.user?.byUnit) {
        unitData = Object.entries(userStats.user.byUnit).map(([unit, count]) => ({
            name: unit || 'No Unit',
            value: count
        }));
    }

    return (
        <>
            <CustomActiveShapePieChart
                data={linkVisibilityData}
                title="Link Visibility"
                type="links"
            />
            {categoryData.length > 0 && (
                <CustomActiveShapePieChart
                    data={categoryData}
                    title="Links by Category"
                    type="links"
                />
            )}
            {unitData.length > 0 && (
                <CustomActiveShapePieChart
                    data={unitData}
                    title="Users by Unit"
                    type="users"
                />
            )}
        </>
    );
};

export default DashboardCustomPieCharts;