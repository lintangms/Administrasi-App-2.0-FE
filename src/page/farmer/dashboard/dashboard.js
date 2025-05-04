import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const DashboardFarming = () => {
    const [coinData, setCoinData] = useState([]);
    const [coinDataAvailable, setCoinDataAvailable] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [games, setGames] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState({ month: false, year: false, game: false, shift: false });

    const years = Array.from({ length: 2027 - new Date().getFullYear() + 1 }, (_, i) => new Date().getFullYear() + i);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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

    const fetchShifts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/shift/get`);
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setShifts(response.data.data);
            } else {
                console.error("Expected an array of shifts, but got:", response.data);
                setShifts([]);
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
        }
    };

    const fetchCoinData = async () => {
        try {
            const formattedMonth = String(selectedMonth).padStart(2, '0');
            const coinResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/statistik/farming`, {
                params: { 
                    bulan: formattedMonth, 
                    tahun: selectedYear, 
                    nama_game: selectedGame, 
                    shift: selectedShift 
                }
            });

            if (coinResponse.data) {
                const coinChartData = coinResponse.data.map(item => ({
                    name: item.nama,
                    nip: item.nip, // Including NIP data
                    saldo_koin: parseInt(item.total_saldo_koin) || 0,
                    koin_dijual: parseInt(item.total_dijual) || 0,
                })).sort((a, b) => b.saldo_koin - a.saldo_koin)
                  .slice(0, 100);

                setCoinData(coinChartData);
                setCoinDataAvailable(coinChartData.length > 0);
            } else {
                setCoinData([]);
                setCoinDataAvailable(false);
            }
        } catch (error) {
            console.error("Error fetching coin data:", error);
            setCoinData([]);
            setCoinDataAvailable(false);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchShifts();
        fetchCoinData();
    }, [selectedMonth, selectedYear, selectedGame, selectedShift]);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f6f9',
            padding: '20px',
            borderRadius: '8px',
            width: '100%',
            boxSizing: 'border-box',
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
        employeeInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            marginBottom: '5px',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        employeeName: {
            fontWeight: 'bold',
        },
        employeeNip: {
            color: '#7f8c8d'
        },
        noDataMessage: {
            textAlign: 'center',
            padding: '20px',
            color: '#7f8c8d',
            fontStyle: 'italic',
        }
    };

    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '10px', 
                    border: '1px solid #ccc',
                    borderRadius: '5px' 
                }}>
                    <p style={{ margin: '0', fontWeight: 'bold' }}>{`${payload[0].payload.name}`}</p>
                    <p style={{ margin: '0', color: '#7f8c8d' }}>{`NIP: ${payload[0].payload.nip}`}</p>
                    <p style={{ margin: '0', color: '#3498db' }}>{`Saldo Koin: ${payload[0].payload.saldo_koin}`}</p>
                    <p style={{ margin: '0', color: '#2ecc71' }}>{`Koin Dijual: ${payload[0].payload.koin_dijual}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Data Perolehan Koin</h2>
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
                                        }}
                                    >
                                        {game.nama_game}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={styles.dropdown}>
                        <button 
                            style={styles.dropdownTrigger}
                            onClick={() => setIsDropdownOpen(prev => ({ ...prev, shift: !prev.shift }))}
                        >
                            <FaChartLine style={{ marginRight: '8px' }} /> 
                            {selectedShift || "Select Shift"}
                        </button>
                        {isDropdownOpen.shift && (
                            <div style={styles.dropdownContent}>
                                <div 
                                    style={{
                                        ...styles.dropdownItem,
                                        backgroundColor: selectedShift === null ? '#e7f1f7' : 'white',
                                    }}
                                    onClick={() => {
                                        setSelectedShift(null);
                                        setIsDropdownOpen(prev => ({ ...prev, shift: false }));
                                    }}
                                >
                                    Select Shift
                                </div>
                                {shifts.map(shift => (
                                    <div 
                                        key={shift.id_shift}
                                        style={{
                                            ...styles.dropdownItem,
                                            backgroundColor: selectedShift === shift.nama_shift ? '#e7f1f7' : 'white',
                                        }}
                                        onClick={() => {
                                            setSelectedShift(shift.nama_shift);
                                            setIsDropdownOpen(prev => ({ ...prev, shift: false }));
                                        }}
                                    >
                                        {shift.nama_shift}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {coinDataAvailable ? (
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.title}>Data Perolehan Koin</h3>
                    </div>
                    <div style={styles.scrollContainer}>
                        <div style={{ minWidth: coinData.length * 100, height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={coinData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                >
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end"
                                        height={70} 
                                        tick={{fontSize: 12}}
                                    />
                                    <YAxis />
                                    <Tooltip content={customTooltip} />
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
                    <div style={styles.noDataMessage}>
                        <h3 style={styles.title}>Data Perolehan Koin Tidak Tersedia</h3>
                        <p>Silakan pilih filter yang berbeda atau periksa koneksi ke server.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardFarming;