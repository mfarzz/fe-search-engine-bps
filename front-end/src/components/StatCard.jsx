import React, { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const StatCard = memo(({ title, value, icon: Icon, trend, isLoading }) => {
    if (!Icon) return null;

    // Fungsi untuk memformat nilai
    const formatValue = (val) => {
        if (val === null || val === undefined) return '-';
        if (typeof val === 'number') return val.toLocaleString();
        return val;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/10 rounded-lg shadow-lg border border-white/10"
        >
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-200 mb-1">{title}</p>
                        {isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-8 w-24 bg-white/10 rounded"></div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2">
                                <h3 className="text-6xl font-bold text-white">
                                    {formatValue(value)}
                                </h3>
                                {trend !== null && trend !== undefined && (
                                    <span className={`text-base mt-1.5 ${trend > 0 ? 'text-green font-bold' : 'text-red-400 font-bold'}`}>
                                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white/10 rounded-full">
                        <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
    ]),
    icon: PropTypes.elementType.isRequired,
    trend: PropTypes.number,
    isLoading: PropTypes.bool
};

StatCard.displayName = 'StatCard';

export default StatCard;