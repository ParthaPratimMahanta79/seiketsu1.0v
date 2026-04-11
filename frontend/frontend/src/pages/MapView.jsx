import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------- FIX DEFAULT ICON ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------- ICONS ---------- */

const dustbinIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/484/484662.png",
  iconSize: [35, 35],
});

const constructionIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [35, 35],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

/* ---------- FLY TO USER ---------- */
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);
  return null;
}

/* ---------- CLICK SELECTOR ---------- */
function LocationSelector({ setSelectedLocation }) {
  useMapEvents({
    click(e) {
      setSelectedLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapView({
  selectedLocation,
  setSelectedLocation,
}) {
  const [userPosition, setUserPosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);

  const centerPosition = [26.1445, 91.7362];

  /* ---------- DUSTBINS WITH STATUS ---------- */
  const dustbins = [
  { id: 1, position: [26.1500, 91.7400], name: "Zoo Road", status: "empty" },
  { id: 2, position: [26.1480, 91.7300], name: "GS Road", status: "empty" },
  { id: 3, position: [26.1420, 91.7250], name: "Paltan Bazaar", status: "in-construction" },
  { id: 4, position: [26.1600, 91.7500], name: "Six Mile", status: "empty" },
  { id: 5, position: [26.1200, 91.8000], name: "Khanapara", status: "empty" },
  { id: 6, position: [26.2000, 91.7000], name: "North Guwahati", status: "empty" },
  { id: 7, position: [26.1800, 91.8200], name: "Panikhaiti", status: "empty" },
  { id: 8, position: [26.1000, 91.6800], name: "Azara", status: "empty" },
  { id: 9, position: [26.2500, 91.6500], name: "Amingaon", status: "empty" },
  { id: 10, position: [26.0500, 91.9000], name: "Sonapur", status: "empty" },
  { id: 11, position: [26.1800, 91.7500], name: "Dispur", status: "empty" },
{ id: 12, position: [26.1200, 91.7800], name: "Khanapara", status: "empty" },
{ id: 13, position: [26.1440, 91.7360], name: "Guwahati Club", status: "empty" },
{ id: 14, position: [26.1300, 91.7200], name: "Bharalumukh", status: "in-construction" },
{ id: 15, position: [26.1700, 91.7600], name: "Noonmati", status: "empty" },
{ id: 16, position: [26.1350, 91.8100], name: "Narengi", status: "empty" },
{ id: 17, position: [26.2000, 91.6500], name: "North Guwahati", status: "empty" },
{ id: 18, position: [26.1100, 91.7500], name: "Basistha", status: "empty" },
{ id: 19, position: [26.3000, 91.6000], name: "Rangia", status: "empty" },
{ id: 20, position: [26.4500, 91.4500], name: "Mangaldoi", status: "empty" },

// Upper Assam
{ id: 21, position: [27.4728, 94.9120], name: "Dibrugarh", status: "empty" },
{ id: 22, position: [26.7575, 94.2031], name: "Jorhat", status: "empty" },
{ id: 23, position: [26.6269, 95.4410], name: "Sivasagar", status: "in-construction" },
{ id: 24, position: [26.9826, 94.6424], name: "Golaghat", status: "empty" },

// Barak Valley
{ id: 25, position: [24.8333, 92.7789], name: "Silchar", status: "empty" },
{ id: 26, position: [24.6820, 92.5640], name: "Hailakandi", status: "empty" },
{ id: 27, position: [24.8670, 92.3550], name: "Karimganj", status: "in-construction" },

// Western Assam
{ id: 28, position: [26.3226, 90.9810], name: "Goalpara", status: "empty" },
{ id: 29, position: [26.4016, 90.2675], name: "Bongaigaon", status: "empty" },
{ id: 30, position: [26.0186, 89.9856], name: "Dhubri", status: "empty" },
// 🏙 Delhi
{ id: 31, position: [28.6139, 77.2090], name: "New Delhi", status: "empty" },
{ id: 32, position: [28.5355, 77.3910], name: "Noida", status: "empty" },

// 🌊 Mumbai
{ id: 33, position: [19.0760, 72.8777], name: "Mumbai CST", status: "empty" },
{ id: 34, position: [19.2183, 72.9781], name: "Thane", status: "in-construction" },

// 🏖 Goa
{ id: 35, position: [15.2993, 74.1240], name: "Panaji", status: "empty" },

// 🕌 Hyderabad
{ id: 36, position: [17.3850, 78.4867], name: "Hyderabad", status: "empty" },

// 🌆 Bangalore
{ id: 37, position: [12.9716, 77.5946], name: "Bangalore", status: "empty" },

// 🏖 Chennai
{ id: 38, position: [13.0827, 80.2707], name: "Chennai Marina", status: "empty" },

// 🕌 Kolkata
{ id: 39, position: [22.5726, 88.3639], name: "Kolkata", status: "empty" },

// 🏛 Jaipur
{ id: 40, position: [26.9124, 75.7873], name: "Jaipur", status: "empty" },

// 🏞 Shimla
{ id: 41, position: [31.1048, 77.1734], name: "Shimla", status: "empty" },

// 🌄 Srinagar
{ id: 42, position: [34.0837, 74.7973], name: "Srinagar", status: "empty" },

// 🏞 Manali
{ id: 43, position: [32.2432, 77.1892], name: "Manali", status: "empty" },

// 🏜 Ahmedabad
{ id: 44, position: [23.0225, 72.5714], name: "Ahmedabad", status: "empty" },

// 🌊 Kochi
{ id: 45, position: [9.9312, 76.2673], name: "Kochi", status: "empty" },

// 🏖 Andaman
{ id: 46, position: [11.7401, 92.6586], name: "Port Blair", status: "empty" },

// 🏞 Leh
{ id: 47, position: [34.1526, 77.5770], name: "Leh", status: "empty" },

// 🌇 Pune
{ id: 48, position: [18.5204, 73.8567], name: "Pune", status: "empty" },

// 🌉 Varanasi
{ id: 49, position: [25.3176, 82.9739], name: "Varanasi", status: "in-construction" },

// 🕌 Lucknow
{ id: 50, position: [26.8467, 80.9462], name: "Lucknow", status: "empty" },


];


  /* ---------- DISTANCE CALC ---------- */
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /* ---------- ROUTE FETCH ---------- */
  const fetchRoute = async (userCoords, binCoords) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${userCoords[1]},${userCoords[0]};${binCoords[1]},${binCoords[0]}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );

        setRouteCoords(coords);
        setDistance((data.routes[0].distance / 1000).toFixed(2));
      }
    } catch (err) {
      console.log("Route fetch error:", err);
    }
  };

  /* ---------- NAVIGATE ---------- */
  const showNearestDustbin = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userCoords = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      setUserPosition(userCoords);

      let minDistance = Infinity;
      let closest = null;

      dustbins
        .filter((bin) => bin.status !== "in-construction") // IGNORE construction
        .forEach((bin) => {
          const dist = getDistance(
            userCoords[0],
            userCoords[1],
            bin.position[0],
            bin.position[1]
          );

          if (dist < minDistance) {
            minDistance = dist;
            closest = bin;
          }
        });

      if (closest) {
        fetchRoute(userCoords, closest.position);
      }
    });
  };

  const cancelNavigation = () => {
    setRouteCoords([]);
    setDistance(null);
  };

  const cancelSelectedLocation = () => {
    if (setSelectedLocation) {
      setSelectedLocation(null);
    }
  };

  return (
    <div style={{ height: "80vh", width: "100%", position: "relative" }}>

      {/* NAVIGATION BUTTON */}
      <button
        onClick={showNearestDustbin}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: "10px 14px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🗑 Navigate to Nearest Dustbin
      </button>

      {/* CANCEL NAVIGATION */}
      {routeCoords.length > 0 && (
        <button
          onClick={cancelNavigation}
          style={{
            position: "absolute",
            top: 60,
            right: 10,
            zIndex: 1000,
            padding: "10px 14px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ❌ Cancel Navigation
        </button>
      )}

      {/* CANCEL SELECTED LOCATION */}
      {selectedLocation && (
        <button
          onClick={cancelSelectedLocation}
          style={{
            position: "absolute",
            top: 110,
            right: 10,
            zIndex: 1000,
            padding: "10px 14px",
            backgroundColor: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ❌ Cancel Selected Location
        </button>
      )}

      {/* DISTANCE BOX */}
      {distance && (
        <div
          style={{
            position: "absolute",
            top: 160,
            right: 10,
            zIndex: 1000,
            background: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Distance: {distance} km
        </div>
      )}

      <MapContainer
        center={centerPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {setSelectedLocation && (
          <LocationSelector setSelectedLocation={setSelectedLocation} />
        )}

        {/* DUSTBINS */}
        {dustbins.map((bin) => (
          <Marker
            key={bin.id}
            position={bin.position}
            icon={
              bin.status === "in-construction"
                ? constructionIcon
                : dustbinIcon
            }
          >
            <Popup>
              {bin.name}
              <br />
              Status: {bin.status}
            </Popup>
          </Marker>
        ))}

        {/* USER */}
        {userPosition && (
          <>
            <Marker position={userPosition} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <FlyTo position={userPosition} />
          </>
        )}

        {/* SELECTED LOCATION */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={redIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        {/* ROUTE */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={6} />
        )}
      </MapContainer>
    </div>
  );
}
