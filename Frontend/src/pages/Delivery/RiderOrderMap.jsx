import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const riderIcon = L.divIcon({
  html: '🏍',
  className: 'rider-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const deliveryIcon = L.divIcon({
  html: '📦',
  className: 'delivery-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const normalizeLocation = (location) => {
  if (!location) return null;

  const lat = Number(location.lat ?? location.latitude ?? location.coordinates?.[1]);
  const lng = Number(location.lng ?? location.longitude ?? location.coordinates?.[0]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
};

const Routing = ({ from, to }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    if (!routingRef.current) {
      routingRef.current = L.Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lng),
          L.latLng(to.lat, to.lng),
        ],
        lineOptions: {
          styles: [{ color: '#E23744', weight: 5 }],
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
      });

      routingRef.current.addTo(map);
    }

    const fromPoint = L.latLng(from.lat, from.lng);
    const toPoint = L.latLng(to.lat, to.lng);

    if (routingRef.current && routingRef.current.setWaypoints) {
      routingRef.current.setWaypoints([fromPoint, toPoint]);
    }

    return () => {
      if (map && routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map || !from || !to || !routingRef.current || !routingRef.current.setWaypoints) return;

    routingRef.current.setWaypoints([
      L.latLng(from.lat, from.lng),
      L.latLng(to.lat, to.lng),
    ]);
  }, [map, from, to]);

  return null;
};



const RiderOrderMap = ({ currentOrder }) => {
  const orderStatus = currentOrder?.status;
  const shopLocation = normalizeLocation(
    currentOrder?.shopLocation ||
      currentOrder?.pickupLocation ||
      currentOrder?.pickupCoordinates ||
      currentOrder?.shop?.autoLocation ||
      currentOrder?.pickupAddress
  );

  const destination = normalizeLocation(
    currentOrder?.deliveryLocation ||
      currentOrder?.deliveryAddress ||
      currentOrder?.destination
  );

  const shouldShowShopRoute = [
    'accepted',
    'preparing',
    'ready_for_rider',
    'rider_assigned',
  ].includes(orderStatus);

  const pickup = shouldShowShopRoute ? shopLocation : null;
  const routeTarget = shouldShowShopRoute ? (shopLocation || destination) : destination;

  const socket = useSocket();
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setRiderLocation(nextLocation);

          if (currentOrder?._id && socket) {
            socket.emit('join-room', currentOrder._id);
            socket.emit('rider:location', {
              room: currentOrder._id,
              riderId: currentOrder?.riderId || 'rider',
              latitude: nextLocation.lat,
              longitude: nextLocation.lng,
            });
          }

          if (currentOrder?._id) {
            api
              .post('/realtime/emit', {
                event: 'rider:location',
                room: currentOrder._id,
                paymentData: {
                  riderId: currentOrder?.riderId || 'rider',
                  latitude: nextLocation.lat,
                  longitude: nextLocation.lng,
                  timestamp: new Date().toISOString(),
                },
              })
              .catch((error) => console.error('Realtime emit failed:', error));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [currentOrder?._id, currentOrder?.riderId, socket]);

  if (!destination && !shopLocation) {
    return (
      <div className="flex h-1/2 w-full items-center justify-center text-sm text-gray-500">
        Loading map...
      </div>
    );
  }

  const center = riderLocation
    ? [riderLocation.lat, riderLocation.lng]
    : pickup
      ? [pickup.lat, pickup.lng]
      : destination
        ? [destination.lat, destination.lng]
        : [shopLocation.lat, shopLocation.lng];
  const routeFrom = riderLocation || pickup || shopLocation || destination;

  return (
    <div className="bottom-0 left-0 h-[350px] w-full">
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full rounded-md"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {riderLocation && (
          <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
            <Popup>You</Popup>
          </Marker>
        )}

        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={riderIcon}>
            <Popup>Shop Location</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={deliveryIcon}>
            <Popup>{shouldShowShopRoute ? 'Customer Location' : 'Delivery Location'}</Popup>
          </Marker>
        )}

        {routeTarget && <Routing from={routeFrom} to={routeTarget} />}
      </MapContainer>
    </div>
  );
};

export default RiderOrderMap;