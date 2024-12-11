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
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const labelFontSize = isMobile ? '9px' : '13px';
    const barThicknessSize = isMobile ? '25' : '40';


    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Profit',
                data: [
                     100, 250, 550, 600, 130, 40, 200, 500, 700, 150, 340, 140
                ],
                backgroundColor: '#84D187',
                hoverBackgroundColor: '#00B207',
                barThickness: barThicknessSize 
            },
            {
                label: 'Loss',
                data: [
                    15, 0, 25, 50, 0, 100, 10, 0, 80, 0, 0, 0
                ],
                backgroundColor: '#EDF2EE',
                barThickness: barThicknessSize
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
                        size: labelFontSize
                    },
                    boxWidth: 15, // Reducing box size helps with overall width
                    padding: 10, // Adjust padding
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
        <div className="p-[4vw] md:p-[1vw] border border-Gray50 rounded-xl w-[80vw] md:w-full md:col-span-2 overflow-scroll custom-scrollbar">
            <h3 className="text-[4.5vw] md:text-[1.5vw] font-semibold text-Gray700 font-Poppins md:mb-2">Monthly Revenue</h3>
            <div className='flex space-x-[1vw] items-center'>
            <div className="text-[4.5vw] md:text-[1.2vw] font-semibold text-Gray700 font-Poppins">$500.00</div>
            <div className="text-Primary font-Poppins text-[3vw] md:text-[0.8vw] flex items-center space-x-[0.1vw]">
                <FaArrowUpLong /> <span> 2% than last month</span>
            </div>
            </div>
            <div className='w-[200%] md:w-full'>
            <Bar data={data} options={options} className='mt-[4vw] md:mt-[2vw]'/>
            </div>
          
        </div>
    );
};

export default RevenueChart;
