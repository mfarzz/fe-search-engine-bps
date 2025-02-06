import React, { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const StatCardTotal = memo(({ title, mainValue, detailValues, icon: Icon, isLoading }) => {
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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-200 mb-1">{title}</p>
                        {isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-8 w-24 bg-white/10 rounded"></div>
                            </div>
                        ) : (
                            <h3 className="text-3xl font-bold text-white">
                                {formatValue(mainValue)}
                            </h3>
                        )}
                    </div>
                    <div className="p-4 bg-white/10 rounded-full">
                        <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                </div>
                
                {/* Detail Values */}
                {!isLoading && detailValues && (
                    <div className="border-t border-white/10 pt-4 mt-2">
                        {detailValues.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-1 last:mb-0">
                                <span className="text-md text-gray-300">{item.label}</span>
                                <span className="text-md text-white font-medium">
                                    {formatValue(item.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
});

StatCardTotal.propTypes = {
    title: PropTypes.string.isRequired,
    mainValue: PropTypes.number,
    detailValues: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })
    ),
    icon: PropTypes.elementType.isRequired,
    isLoading: PropTypes.bool
};

StatCardTotal.displayName = 'StatCardTotal';

export default StatCardTotal;