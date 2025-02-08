import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardFarming = () => {
    const [farmingData, setFarmingData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchFarmingData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/farming`, {
                params: { bulan: selectedMonth, tahun: selectedYear }
            });

            const farmingChartData = response.data
                .sort((a, b) => b.total_farming - a.total_farming)
                .slice(0, 100)
                .map(item => ({
                    name: item.nama,
                    koin: item.total_farming,
                }));

            setFarmingData(farmingChartData);
        } catch (error) {
            console.error("Error fetching farming data:", error);
        }
    };

    useEffect(() => {
        fetchFarmingData();
    }, [selectedMonth, selectedYear]);

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.3rem', fontWeight: 'bold' }}>Data Perolehan Farming</h3>
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <div style={{ minWidth: farmingData.length * 100, height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={farmingData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="koin" fill="#3498db" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardFarming;