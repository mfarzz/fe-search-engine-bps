import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Legend } from 'recharts';

const DailyTrafficChart = ({ dailyData, topLinkDaily }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        if (dailyData && topLinkDaily) {
            // Create combined data array with all dates
            const combined = dailyData.map(visitor => {
                // Find matching click data for this day
                const clickInfo = topLinkDaily.find(click => click.day === visitor.day);
                
                return {
                    day: visitor.day,
                    count: visitor.count || 0,
                    click_count: clickInfo ? clickInfo.click_count : 0
                };
            });

            // Filter by selected month/year
            const filtered = combined.filter(item => {
                const date = new Date(item.day);
                return date.getMonth() === selectedMonth && 
                       date.getFullYear() === selectedYear;
            });

            setCombinedData(filtered.sort((a, b) => new Date(a.day) - new Date(b.day)));
        }
    }, [dailyData, topLinkDaily, selectedMonth, selectedYear]);

    // Get unique years from dailyData
    const years = Array.from(new Set(dailyData?.map(item =>
        new Date(item.day).getFullYear()
    ))).sort((a, b) => b - a);

    const months = [    
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ];

    if (!dailyData?.length || !topLinkDaily?.length) {
        return (
            <div className="backdrop-blur-xl bg-white/10 rounded-lg shadow-lg border border-white/10 p-6">
                <div className="text-white">Loading data...</div>
            </div>
        );
    }

    const maxVisits = Math.max(...combinedData.map(item => item.count));
    const maxClicks = Math.max(...combinedData.map(item => item.click_count));
    const yAxisMax = Math.max(maxVisits, maxClicks) === 0 ? 5 : Math.ceil(Math.max(maxVisits, maxClicks) * 1.2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/10 rounded-lg shadow-lg border border-white/10 p-6"
        >
            <div className="mb-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Daily Traffic</h2>
                        <p className="text-sm text-gray-300">Daily visitor and click statistics</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                            {months.map((month) => (
                                <option
                                    key={month.value}
                                    value={month.value}
                                    className="bg-gray-800 text-white"
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                            {years.map((year) => (
                                <option
                                    key={year}
                                    value={year}
                                    className="bg-gray-800 text-white"
                                >
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={combinedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="day"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.getDate();
                            }}
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                            allowDecimals={false}
                            domain={[0, yAxisMax]}
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(17, 25, 40, 0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(10px)'
                            }}
                            labelStyle={{ color: 'white' }}
                            itemStyle={{ color: 'white' }}
                            labelFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            }}
                        />
                        <Legend 
                            iconType="circle"
                            wrapperStyle={{ color: 'white' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Visits"
                            // stackId="1"
                            stroke="#22d3ee"
                            fill="url(#visitsGradient)"
                            strokeWidth={2}
                            dot={{
                                r: 2,
                                fill: '#22d3ee',
                                strokeWidth: 0
                            }}
                            activeDot={{
                                r: 6,
                                fill: '#22d3ee',
                                stroke: 'white',
                                strokeWidth: 2
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="click_count"
                            name="Clicks"
                            // stackId="1"
                            stroke="#f472b6"
                            fill="url(#clicksGradient)"
                            strokeWidth={2}
                            dot={{
                                r: 2,
                                fill: '#f472b6',
                                strokeWidth: 0
                            }}
                            activeDot={{
                                r: 6,
                                fill: '#f472b6',
                                stroke: 'white',
                                strokeWidth: 2
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

DailyTrafficChart.propTypes = {
    dailyData: PropTypes.arrayOf(PropTypes.shape({
        day: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired
    })),
    topLinkDaily: PropTypes.arrayOf(PropTypes.shape({
        day: PropTypes.string,
        click_count: PropTypes.number,
        links: PropTypes.array
    }))
};

export default DailyTrafficChart;