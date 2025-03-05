import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
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
    const [yearlyFarmingData, setYearlyFarmingData] = useState([]);
    const [yearlyBoostingData, setYearlyBoostingData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedGame, setSelectedGame] = useState(null);
    const [games, setGames] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState({ month: false, year: false, game: false });
    const [coinData, setCoinData] = useState([]);
    const [boostingDataAvailable, setBoostingDataAvailable] = useState(false);
    const [coinDataAvailable, setCoinDataAvailable] = useState(false);

    const years = Array.from({ length: 2027 - new Date().getFullYear() + 1 }, (_, i) => new Date().getFullYear() + i);
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

    const fetchGames = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/game/get`);
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setGames(response.data.data);
            } else {
                console.error("Expected an array of games, but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    const fetchPerformanceData = async () => {
        try {
            const formattedMonth = String(selectedMonth).padStart(2, '0'); // Ensure month is two digits
            const coinResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/farming/getall`, {
                params: { bulan: formattedMonth, tahun: selectedYear, nama_game: selectedGame }
            });

            if (coinResponse.data && coinResponse.data.data) {
                const coinChartData = coinResponse.data.data
                    .map(item => ({
                        name: item.nama,
                        saldo_koin: parseInt(item.saldo_koin),
                        koin_dijual: parseInt(item.total_dijual) || 0,
                    }))
                    .sort((a, b) => b.saldo_koin - a.saldo_koin)
                    .slice(0, 100);

                setCoinData(coinChartData);
                setCoinDataAvailable(coinChartData.length > 0);
            } else {
                setCoinData([]);
                setCoinDataAvailable(false);
            }

            const boostingResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/boosting`, {
                params: { bulan: formattedMonth, tahun: selectedYear, nama_game: selectedGame }
            });

            if (boostingResponse.data) {
                const boostingChartData = boostingResponse.data
                    .sort((a, b) => b.total_boosting - a.total_boosting)
                    .slice(0, 100)
                    .map(item => ({
                        name: item.nama,
                        nominal: item.total_boosting,
                    }));

                setBoostingData(boostingChartData);
                setBoostingDataAvailable(boostingChartData.length > 0);
            } else {
                setBoostingData([]);
                setBoostingDataAvailable(false);
            }
        } catch (error) {
            console.error("Error fetching performance data:", error);
            setCoinData([]);
            setBoostingData([]);
            setCoinDataAvailable(false);
            setBoostingDataAvailable(false);
        }
    };

    const fetchYearlyData = async () => {
        try {
            const farmingYearlyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/totalfarming`, {
                params: { tahun: selectedYear, nama_game: selectedGame }
            });

            const boostingYearlyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/totalboosting`, {
                params: { tahun: selectedYear, nama_game: selectedGame }
            });

            setYearlyFarmingData(farmingYearlyResponse.data);
            setYearlyBoostingData(boostingYearlyResponse.data);
        } catch (error) {
            console.error("Error fetching yearly data:", error);
        }
    };

    useEffect(() => {
        fetchTotalData();
        fetchGames();
        fetchPerformanceData();
        fetchYearlyData();
    }, [selectedMonth, selectedYear, selectedGame]);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f6f9',
            padding: '20px',
            borderRadius: '8px',
            width: '100%',
            boxSizing: 'border-box',
        },
        statsRow: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
        },
        statCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            '@media (min-width: 768px)': {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
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
            flexWrap: 'wrap',
        },
        dropdown: {
            position: 'relative',
        },
        dropdownTrigger: {
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
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
            padding: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '0.9rem',
        },
        chartCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            padding: '15px',
            width: '100%',
            boxSizing: 'border-box',
        },
        chartHeader: {
            borderBottom: '1px solid #ecf0f1',
            paddingBottom: '10px',
            marginBottom: '15px',
        },
        scrollContainer: {
            overflowX: 'auto',
            width: '100%',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: '-ms-autohiding-scrollbar',
        },
        lineChartsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
        },
        lineChart: {
            flex: 1,
            marginRight: '10px',
        },
        lineChartLast: {
            flex: 1,
            marginLeft: '10px',
        },
    };

    return (
        <div style={styles.container}>
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

            <div style={styles.header}>
                <h2 style={styles.title}>Farming & Boosting Perolehan</h2>
                <div style={styles.filterContainer}>
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
                                            fetchYearlyData();
                                        }}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={styles.dropdown}>
                        <button 
                            style={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(prev => ({ ...prev, game: !prev.game }))}
                        >
                            <FaChartLine style={{ marginRight: '8px' }} /> 
                            {selectedGame || "Select Game"}
                        </button>
                        {isDropdownOpen.game && (
                            <div style={styles.dropdownContent}>
                                <div 
                                    style={{
                                        ...styles.dropdownItem,
                                        backgroundColor: selectedGame === null ? '#e7f1f7' : 'white',
                                    }}
                                    onClick={() => {
                                        setSelectedGame(null);
                                        setIsDropdownOpen(prev => ({ ...prev, game: false }));
                                        fetchPerformanceData();
                                        fetchYearlyData();
                                    }}
                                >
                                    Select Game
                                </div>
                                {games.map(game => (
                                    <div 
                                        key={game.id_game}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: selectedGame === game.nama_game ? '#e7f1f7' : 'white',
                                        }}
                                        onClick={() => {
                                            setSelectedGame(game.nama_game);
                                            setIsDropdownOpen(prev => ({ ...prev, game: false }));
                                            fetchPerformanceData();
                                            fetchYearlyData();
                                        }}
                                    >
                                        {game.nama_game}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={styles.lineChartsContainer}>
                <div style={styles.lineChart}>
                    <div style={styles.chartCard}>
                        <div style={styles.chartHeader}>
                            <h3 style={styles.title}>Data Perolehan Farming per Tahun</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={yearlyFarmingData}>
                                <XAxis dataKey="bulan" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total_farming" stroke="#3498db" strokeWidth={3} dot={{ stroke: '#3498db', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.lineChartLast}>
                    <div style={styles.chartCard}>
                        <div style={styles.chartHeader}>
                            <h3 style={styles.title}>Data Perolehan Boosting per Tahun</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={yearlyBoostingData}>
                                <XAxis dataKey="bulan" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total_boosting" stroke="#2ecc71" strokeWidth={3} dot={{ stroke: '#2ecc71', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {coinDataAvailable ? (
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.title}>Data Perolehan Koin</h3>
                    </div>
                    <div style={styles.scrollContainer}>
                        <div style={{ minWidth: coinData.length * 100, height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={coinData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="saldo_koin" name="Saldo Koin" fill="#3498db" barSize={30} />
                                    <Bar dataKey="koin_dijual" name="Koin Dijual" fill="#2ecc71" barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={styles.chartCard}>
                    <h3 style={styles.title}>Data Perolehan Koin Tidak Tersedia</h3>
                </div>
            )}

            {boostingDataAvailable ? (
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.title}>Data Perolehan Boosting</h3>
                    </div>
                    <div style={styles.scrollContainer}>
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
            ) : (
                <div style={styles.chartCard}>
                    <h3 style={styles.title}>Data Perolehan Boosting Tidak Tersedia</h3>
                </div>
            )}
        </div>
    );
};

export default Dashboard;