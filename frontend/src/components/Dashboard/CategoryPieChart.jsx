import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from "chart.js";
import {useState, useEffect} from "react";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CategoryPieChart = () => {
    const [chartData, setChartData] = useState('');

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;

    const headerFontSize = isMobile ? '15px' : '20px';
    const labelFontSize = isMobile ? '10px' : '14px';

    const fetchCategoryStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/category-stats`);
            const result = response.data;

            if (result.success) {
                return result.data;
            } else {
                console.error("Error in API response:", result.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching category stats:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCategoryStats();

            if (data && data.length > 0) {
                const labels = data.map((item) => item._id);
                const counts = data.map((item) => item.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Products by Category",
                            data: counts,
                            backgroundColor: [
                                "#4CAF50",
                                "#66BB6A",
                                "#81C784",
                                "#A5D6A7",
                                "#C8E6C9",
                                "#B4CCB4"
                            ],
                            hoverBackgroundColor: [
                                "#388E3C",
                                "#43A047",
                                "#66BB6A",
                                "#81C784",
                                "#A5D6A7",
                                "#7A997C"
                            ],
                            borderWidth: 0
                        }
                    ]
                });
            } else {
                console.warn("No data available for the chart.");
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Product Distribution by Category",
                font: {
                    family: "Poppins",
                    size: headerFontSize
                }
                
            },
            legend: {
                labels: {
                    font: {
                        family: "Poppins", // Custom font family
                        size: labelFontSize
                    },
                    boxWidth: 15, // Reducing box size helps with overall width
                    padding: 10, // Adjust padding
                },
                display: true,
                position: 'bottom', // or 'bottom', 'left', 'right'
            },            
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        const total = tooltipItem
                            .dataset
                            .data
                            .reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${tooltipItem.label}: ${value} products (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div
            className="bg-white p-[4vw] md:p-[1vw] rounded-lg shadow-lg min-h-[35vw] w-[80vw] md:w-full flex justify-center items-center">
            {
                chartData
                    ? (<Pie data={chartData} options={options}enterKeyHint=""/>)
                    : (
                        <div className="flex flex-col justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                            <h3 className="text-[1vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                Loading chart, please wait...
                            </h3>
                        </div>
                    )
            }
        </div>
    );
};

export default CategoryPieChart;
