import SalesChart from "../../components/Shopkeeper/Dashboard/SalesChart";
import RecentOrders from "../../components/Shopkeeper/Dashboard/RecentOrders";
import QuickActions from "../../components/Shopkeeper/Dashboard/QuickActions";
import Analytics from "./Analytics";
import BottomNavbar from "../../components/Shopkeeper/BottomNavbar";
import CreateShop from "../Shopkeeper/CreateShop";
import { useState, useEffect } from "react";
import api from "../../api/axios";

const Dashboard = () => {

    const [shop, setShop] = useState(null);
    
    const [loading, setLoading] = useState(true);

    const fetchMyShop = async () => {
        try {
            const response = await api.get("/shops/my-shop");
            setShop(response.data.shop);
        } catch (error) {
            console.error("Error fetching shop data:", error);
            setShop(null);
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