import { createContext, useContext, useEffect, useState } from "react";

const ServiceBookingContext = createContext();

export const ServiceBookingProvider = ({ children }) => {

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("serviceBookings");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "serviceBookings",
      JSON.stringify(bookings)
    );
  }, [bookings]);

  const bookService = (booking) => {

    setBookings(prev => [

      ...prev,

      {

        id: crypto.randomUUID(),

        status: "Pending",

        date: new Date().toLocaleDateString(),

        ...booking,

      },

    ]);

  };

  const getMyBookings = () => {

    const owner =
      localStorage.getItem("serviceOwner");

    return bookings.filter(

      booking => booking.owner === owner

    );

  };
  const updateBookingStatus = (id, status) => {

  setBookings(prev =>
    prev.map(booking =>
      booking.id === id
        ? {
            ...booking,
            status,
          }
        : booking
    )
  );

};

const getCustomerBookings = () => {

  return bookings.filter(
    booking => booking.customer === "Current Customer"
  );

};

  return (

    <ServiceBookingContext.Provider

      value={{

        bookings,

        bookService,

        getMyBookings,
        
        getCustomerBookings,

        updateBookingStatus,

      }}

    >

      {children}

    </ServiceBookingContext.Provider>

  );

};

export const useServiceBookings = () =>
  useContext(ServiceBookingContext);