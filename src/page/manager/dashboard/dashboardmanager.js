import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaUsers, FaDollarSign, FaChartLine, FaBox, FaCalendarAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [totalData, setTotalData] = useState({
        jumlah_karyawan: 0,
        total_farming: 0,
        total_boosting: 0,
        jumlah_inventaris: 0,
    });
    const [farmingData, setFarmingData] = useState([]);
    const [boostingData, setBoostingData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isDropdownOpen, setIsDropdownOpen] = useState({ month: false, year: false });

    // Generate years array (last 5 years)
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    // Months array
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const fetchTotalData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/total`);
            setTotalData(response.data);
        } catch (error) {
            console.error("Error fetching total data:", error);
        }
    };

    const fetchPerformanceData = async () => {
        try {
            const farmingResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/farming`, {
                params: { bulan: selectedMonth, tahun: selectedYear }
            });

            const boostingResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/boosting`, {
                params: { bulan: selectedMonth, tahun: selectedYear }
            });

            // Transform data for charts, limit to top 5
            const farmingChartData = farmingResponse.data
                .sort((a, b) => b.total_farming - a.total_farming)
                .slice(0, 100)
                .map(item => ({
                    name: item.nama,
                    koin: item.total_farming,
                    baseline: 0
                }));

            const boostingChartData = boostingResponse.data
                .sort((a, b) => b.total_boosting - a.total_boosting)
                .slice(0, 100)
                .map(item => ({
                    name: item.nama,
                    nominal: item.total_boosting,
                    baseline: 0
                }));

            setFarmingData(farmingChartData);
            setBoostingData(boostingChartData);
        } catch (error) {
            console.error("Error fetching performance data:", error);
        }
    };

    useEffect(() => {
        fetchTotalData();
        fetchPerformanceData();
    }, [selectedMonth, selectedYear]);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f6f9',
            padding: '20px',
            borderRadius: '8px',
        },
        statsRow: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: '20px',
        },
        statCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '15px',
            width: '22%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '10px 0', // Add margin for spacing
        },
        statIcon: {
            color: '#3498db',
            fontSize: '2rem',
        },
        statContent: {
            textAlign: 'right',
        },
        statTitle: {
            margin: 0,
            color: '#7f8c8d',
            fontSize: '0.9rem',
        },
        statValue: {
            margin: 0,
            color: '#2c3e50',
            fontSize: '1.5rem',
            fontWeight: 'bold',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
        title: {
            margin: 0,
            color: '#2c3e50',
            fontSize: '1.5rem',
            fontWeight: 'bold',
        },
        filterContainer: {
            display: 'flex',
            gap: '10px',
        },
        dropdown: {
            position: 'relative',
        },
        dropdownTrigger: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
        },
        dropdownContent: {
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            minWidth: '150px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '6px',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
        },
        dropdownItem: {
            padding: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        chartCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            padding: '15px',
        },
        chartHeader: {
            borderBottom: '1px solid #ecf0f1',
            paddingBottom: '10px',
            marginBottom: '15px',
        },
        scrollContainer: {
            overflowX: 'auto',
            width: '100%',
        }
    };

    return (
        <div style={styles.container}>
            {/* Total Stats Row */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <FaUsers style={styles.statIcon} />
                    <div style={styles.statContent}>
                        <h5 style={styles.statTitle}>Karyawan</h5>
                        <h2 style={styles.statValue}>{totalData.jumlah_karyawan}</h2>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <FaDollarSign style={styles.statIcon} />
                    <div style={styles.statContent}>
                        <h5 style={styles.statTitle}>Total Farming</h5>
                        <h2 style={styles.statValue}>{totalData.total_farming}</h2>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <FaChartLine style={styles.statIcon} />
                    <div style={styles.statContent}>
                        <h5 style={styles.statTitle}>Total Boosting</h5>
                        <h2 style={styles.statValue}>{totalData.total_boosting}</h2>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <FaBox style={styles.statIcon} />
                    <div style={styles.statContent}>
                        <h5 style={styles.statTitle}>Inventaris</h5>
                        <h2 style={styles.statValue}>{totalData.jumlah_inventaris}</h2>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div style={styles.header}>
                <h2 style={styles.title}>Farming & Boosting Perolehan</h2>
                <div style={styles.filterContainer}>
                    {/* Month Dropdown */}
                    <div style={styles.dropdown}>
                        <button 
                            style={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(prev => ({ ...prev, month: !prev.month }))}
                        >
                            <FaCalendarAlt style={{ marginRight: '8px' }} /> 
                            {months[selectedMonth - 1]}
                        </button>
                        {isDropdownOpen.month && (
                            <div style={styles.dropdownContent}>
                                {months.map((month, index) => (
                                    <div 
                                        key={month}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: selectedMonth === index + 1 ? '#e7f1f7' : 'white',
                                        }}
                                        onClick={() => {
                                            setSelectedMonth(index + 1);
                                            setIsDropdownOpen(prev => ({ ...prev, month: false }));
                                        }}
                                    >
                                        {month}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Year Dropdown */}
                    <div style={styles.dropdown}>
                        <button 
                            style={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(prev => ({ ...prev, year: !prev.year }))}
                        >
                            <FaCalendarAlt style={{ marginRight: '8px' }} /> 
                            {selectedYear}
                        </button>
                        {isDropdownOpen.year && (
                            <div style={styles.dropdownContent}>
                                {years.map(year => (
                                    <div 
                                        key={year}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: selectedYear === year ? '#e7f1f7' : 'white',
                                        }}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setIsDropdownOpen(prev => ({ ...prev, year: false }));
                                        }}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Farming Performance Chart */}
            <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Data Perolehan Farming</h3>
                </div>
                <div style={styles.scrollContainer}>
                    <ResponsiveContainer width={farmingData.length * 150} height={300}>
                        <BarChart 
                            data={farmingData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="koin" fill="#3498db" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Boosting Performance Chart */}
            <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>Data Perolehan Boosting</h3>
                </div>
                <div style={styles.scrollContainer}>
                    <ResponsiveContainer width={boostingData.length * 150} height={300}>
                        <BarChart 
                            data={boostingData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="nominal" fill="#2ecc71" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;