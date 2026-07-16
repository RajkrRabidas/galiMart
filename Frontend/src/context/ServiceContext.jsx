import { createContext, useContext, useEffect, useState } from "react";

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {

  const [providers, setProviders] = useState(() => {

    const saved = localStorage.getItem("serviceProviders");

    return saved ? JSON.parse(saved) : [];

  });

  useEffect(() => {

    localStorage.setItem(

      "serviceProviders",

      JSON.stringify(providers)

    );

  }, [providers]);

  const createBusiness = (business) => {

  setProviders(prev => {

    const exists = prev.some(
      provider => provider.owner === business.owner
    );

    if (exists) return prev;

    return [
      ...prev,
      {
        id: crypto.randomUUID(),
        owner: business.owner,
        businessName: business.businessName,
        category: business.category,
        address: business.address,
        image: business.image,
        services: [],
      },
    ];

  });

};

  const getMyBusiness = () => {

    const owner = localStorage.getItem("serviceOwner");

    return providers.find(

      provider => provider.owner === owner

    );

  };

  const addService = (owner, service) => {

    setProviders(prev =>

      prev.map(provider =>

        provider.owner === owner

          ? {

              ...provider,

              services: [

                ...provider.services,

                {

                  ...service,

                  id: Date.now(),

                },

              ],

            }

          : provider

      )

    );

  };

  const updateService = (owner, updatedService) => {

    setProviders(prev =>

      prev.map(provider =>

        provider.owner === owner

          ? {

              ...provider,

              services: provider.services.map(service =>

                service.id === updatedService.id

                  ? updatedService

                  : service

              ),

            }

          : provider

      )

    );

  };

  const deleteService = (owner, id) => {

    setProviders(prev =>

      prev.map(provider =>

        provider.owner === owner

          ? {

              ...provider,

              services: provider.services.filter(

                service => service.id !== id

              ),

            }

          : provider

      )

    );

  };

  return (

    <ServiceContext.Provider

      value={{

        providers,

        createBusiness,

        getMyBusiness,

        addService,

        updateService,

        deleteService,

      }}

    >

      {children}

    </ServiceContext.Provider>

  );

};

export const useServices = () => useContext(ServiceContext);