import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardBooster = () => {
    const [boostingData, setBoostingData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchBoostingData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/boosting`, {
                params: { bulan: selectedMonth, tahun: selectedYear }
            });

            const boostingChartData = response.data
                .sort((a, b) => b.total_boosting - a.total_boosting)
                .slice(0, 100)
                .map(item => ({
                    name: item.nama,
                    nominal: item.total_boosting,
                }));

            setBoostingData(boostingChartData);
        } catch (error) {
            console.error("Error fetching boosting data:", error);
        }
    };

    useEffect(() => {
        fetchBoostingData();
    }, [selectedMonth, selectedYear]);

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.3rem', fontWeight: 'bold' }}>Data Perolehan Boosting</h3>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <div style={{ minWidth: boostingData.length * 100, height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={boostingData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="nominal" fill="#2ecc71" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardBooster;