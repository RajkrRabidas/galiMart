import SalesChart from "../../components/Shopkeeper/Dashboard/SalesChart";
import RecentOrders from "../../components/Shopkeeper/Dashboard/RecentOrders";
import QuickActions from "../../components/Shopkeeper/Dashboard/QuickActions";
import Analytics from "./Analytics";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import CreateShop from "../Shopkeeper/CreateShop";
import { useState, useEffect } from "react";

const Dashboard = () => {

    const [shop, setShop] = useState(null);
    
    const [loading, setLoading] = useState(true);

    const fetchMyShop = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/shops/my-shop", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const {data} = await response.json();
            setShop(data.shop);

            if(data.token) {
                localStorage.setItem("token", data.token);
            }

        } catch (error) {
            console.error("Error fetching shop data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyShop();
    }, []);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center"><p className="text-gray-500">Loading your Shop...</p></div>;
    }

    if(!shop) {
        return <CreateShop/>;
    }

  return (

    <div>
        
    </div>

  );

};

export default Dashboard;