import groceriesImage from "../../assets/groceries.png";
import restaurantImage from "../../assets/restaurant.jfif";
import fashionImage from "../../assets/fashion.jfif";
import medicineImage from "../../assets/medicine.jfif";
import electronicsImage from "../../assets/electronics.jfif";
import servicesImage from "../../assets/services.jfif";

export const categories = [
  {
    id: 1,
    key: "groceries",
    title: "Groceries",
    image: groceriesImage,
    bg: "from-emerald-100 via-emerald-200 to-emerald-50",
  },
  {
    id: 2,
    key: "restaurants",
    title: "Restaurants",
    image: restaurantImage,
    bg: "from-rose-100 via-rose-200 to-rose-50",
  },
  {
    id: 3,
    key: "fashion",
    title: "Fashion",
    image: fashionImage,
    bg: "from-fuchsia-100 via-fuchsia-200 to-fuchsia-50",
  },
  {
    id: 4,
    key: "medicine",
    title: "Medicine",
    image: medicineImage,
    bg: "from-yellow-100 via-yellow-200 to-yellow-50",
  },
  {
    id: 5,
    key: "electronics",
    title: "Electronics",
    image: electronicsImage,
    bg: "from-indigo-100 via-indigo-200 to-indigo-50",
  },
  {
    id: 6,
    key: "services",
    title: "Services",
    image: servicesImage,
    bg: "from-cyan-100 via-cyan-200 to-cyan-50",
  }
];