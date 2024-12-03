import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { FaArrowUpLong } from "react-icons/fa6";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Profit',
                data: [
                     100, 250, 550, 600, 130, 40, 200, 500, 700, 150, 340, 140
                ],
                backgroundColor: '#84D290',
                barThickness: 40, // Adjust bar thickness here
            },
            {
                label: 'Loss',
                data: [
                    15, 0, 25, 50, 0, 100, 10, 0, 80, 0, 0, 0
                ],
                backgroundColor: '#DAE5DA',
                barThickness: 40, // Adjust bar thickness here
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        family: 'Poppins',
                        size: 12,
                    },
                    color: '#333',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `$${context.raw.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false, // Remove the x-axis grid
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 12,
                    },
                    color: '#666',
                },
            },
            y: {
                beginAtZero: true,
                stacked: true,
                grid: {
                    display: false, // Remove the y-axis grid
                },
                ticks: {
                    callback: (value) => `$${value * 1}`,
                    font: {
                        family: 'Poppins',
                        size: 12,
                    },
                    color: '#666',
                },
            },
        },
    };

    return (
        <div className="bg-white p-[4vw] md:p-[1vw] rounded-lg shadow-lg w-[80vw] md:w-full md:col-span-2">
            <h3 className="text-[4.5vw] md:text-[1.5vw] font-semibold text-Gray700 font-Poppins md:mb-2">Monthly Revenue</h3>
            <div className='flex space-x-[1vw] items-center'>
            <div className="text-[4.5vw] md:text-[1.2vw] font-semibold text-Gray700 font-Poppins">$500.00</div>
            <div className="text-Primary font-Poppins text-[3vw] md:text-[0.8vw] flex items-center space-x-[0.1vw]">
                <FaArrowUpLong /> <span> 2% than last month</span>
            </div>
            </div>
            <Bar data={data} options={options} className='mt-[4vw] md:mt-0'/>
        </div>
    );
};

export default RevenueChart;
