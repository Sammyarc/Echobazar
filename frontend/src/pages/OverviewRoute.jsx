import { useEffect } from "react";
import CategoryPieChart from "../components/Dashboard/CategoryPieChart"
import OverviewGrid from "../components/Dashboard/OverviewGrid"
import RevenueChart from "../components/Dashboard/RevenueChart"
import OrderList from "../components/Dashboard/OrderList";

const OverviewRoute = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pr-[2vw]">
            <OverviewGrid />
            <div className="grid md:grid-cols-3 gap-5 md:gap-10">
                <RevenueChart/>
                <CategoryPieChart/>
            </div>
            <OrderList />
        </div>

    )
}

export default OverviewRoute