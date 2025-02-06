import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, Link as LinkIcon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    hourlyVisitors, dailyVisitors, summaryVisitors, countLink, countUsers, dailyLink, hourlyLink, topLink, topLinkDaily
} from '../services/dashboard.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/SideBar';
import useRole from '../hooks/useRole';
import StatCard from '../components/StatCard';
import DailyTrafficChart from '../components/DailyTrafficChart';
import DashboardCustomPieCharts from '../components/DashboardDonutCharts';
import StatCardTotal from '../components/StatCardTotal';
import TopLinksCard from '@/components/TopLinksCard';

const AnimatedBackground = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const createNode = () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2,
        });

        setNodes(Array.from({ length: 30 }, createNode));

        const animate = () => {
            setNodes(prevNodes =>
                prevNodes.map(node => ({
                    ...node,
                    x: (node.x + node.vx + window.innerWidth) % window.innerWidth,
                    y: (node.y + node.vy + window.innerHeight) % window.innerHeight,
                }))
            );
        };

        const interval = setInterval(animate, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900">
            <svg className="absolute inset-0 w-full h-full">
                {nodes.map((node, i) => (
                    <g key={i}>
                        {nodes.map((otherNode, j) => {
                            const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                            if (distance < 150 && i < j) {
                                return (
                                    <line
                                        key={`${i}-${j}`}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={otherNode.x}
                                        y2={otherNode.y}
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="1"
                                    />
                                );
                            }
                            return null;
                        })}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size}
                            fill="rgba(255,255,255,0.5)"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};

const Dashboard = () => {
    const [hourlyData, setHourlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [summary, setSummary] = useState({ lastHour: 0, today: 0, total: 0 });
    const [linkStats, setLinkStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [hourlyLinkData, setHourlyLinkData] = useState([]);
    const [dailyLinkData, setDailyLinkData] = useState([]);
    const [topLinkData, setTopLinkData] = useState([]);
    const [topLinkDailyData, setTopLinkDailyData] = useState([]);
    const role = useRole();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hourly, daily, summaryData, links, users, hourly_Link, daily_Link, top_Link, top_LinkDaily] = await Promise.all([
                    hourlyVisitors(),
                    dailyVisitors(),
                    summaryVisitors(),
                    countLink(),
                    countUsers(),
                    hourlyLink(),
                    dailyLink(),
                    topLink(),
                    topLinkDaily()
                ]);

                setDailyData(daily.data);
                setHourlyData(hourly.data);
                setSummary(summaryData.data);
                setLinkStats(links.data);
                setUserStats(users.data);
                setHourlyLinkData(hourly_Link.data);
                setDailyLinkData(daily_Link.data);
                setTopLinkData(top_Link.data);
                setTopLinkDailyData(top_LinkDaily.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <AnimatedBackground />
            <Navbar />
            <Sidebar role={role} />

            <main className="flex-1 relative z-10 pt-20 px-4">
                <div className="max-w-7xl mx-auto pb-20">
                    {/* Header Row with Flex */}
                    <div className="flex justify-between items-center mb-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 text-center" // Added text-center here
                        >
                            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                            <p className="text-gray-300 mt-2">Monitor your platform's performance</p>
                        </motion.div>

                        {/* Top Links Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <TopLinksCard topLinks={topLinkData} />
                        </motion.div>
                    </div>

                    {/* Platform Statistics Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-xl font-semibold text-white mb-6">Platform Statistics</h2>

                        {/* Total Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <StatCardTotal
                                title="Total Users"
                                mainValue={userStats ? userStats.user.total + userStats.umum : null}
                                detailValues={userStats ? [
                                    { label: 'BPS Users', value: userStats.user.total },
                                    { label: 'Non-BPS Users', value: userStats.umum }
                                ] : []}
                                icon={Users}
                                isLoading={!userStats}
                            />
                            <StatCardTotal
                                title="Total Links"
                                mainValue={linkStats ? linkStats.totals.public + linkStats.totals.private : null}
                                detailValues={linkStats ? [
                                    { label: 'Public Links', value: linkStats.totals.public },
                                    { label: 'Private Links', value: linkStats.totals.private }
                                ] : []}
                                icon={LinkIcon}
                                isLoading={!linkStats}
                            />
                        </div>

                        {/* Donut Charts in 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <DashboardCustomPieCharts
                                linkStats={linkStats}
                                userStats={userStats}
                            />
                        </div>
                    </motion.div>

                    {/* Traffic Monitoring Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Section Divider */}
                        <div className="absolute -top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <h2 className="text-xl font-semibold text-white mb-6">Traffic Monitoring</h2>

                        {/* Traffic Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Real-time Users"
                                value={summary.lastHour}
                                icon={Activity}
                                trend={summary.lastHour - (summary.today - summary.lastHour)}
                            />
                            <StatCard
                                title="Today's Visitors"
                                value={summary.today}
                                icon={Users}
                                trend={summary.today - summary.lastHour}
                            />
                            <StatCard
                                title="Total Visits"
                                value={summary.total}
                                icon={Clock}
                                trend={summary.total - summary.today}
                            />
                        </div>

                        {/* Traffic Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Hourly Traffic */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="backdrop-blur-xl bg-white/10 rounded-lg shadow-lg border border-white/10 p-6"
                            >
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-white">Hourly Traffic</h2>
                                    <p className="text-sm text-gray-300">Visitors over the last 24 hours</p>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={hourlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis
                                                dataKey="hour"
                                                tickFormatter={(value) => new Date(value).getHours() + 'h'}
                                                stroke="rgba(255,255,255,0.5)"
                                            />
                                            <YAxis stroke="rgba(255,255,255,0.5)" />
                                            <Tooltip
                                                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                                labelStyle={{ color: 'white' }}
                                                itemStyle={{ color: 'white' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#22d3ee"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{ r: 6, fill: '#22d3ee' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Daily Traffic */}
                            <DailyTrafficChart
                                dailyData={dailyData}
                                topLinkDaily={dailyLinkData}
                            />
                        </div>
                    </motion.div>
                </div>
            </main>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;