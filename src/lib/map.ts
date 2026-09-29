import { Driver, MarkerData } from "@/types/type";

const AVERAGE_DRIVER_SPEED_KMH = 28;
const BASE_FARE = 15000;
const PER_MINUTE_RATE = 2500;

const estimateTravelMinutes = (
  originLatitude: number,
  originLongitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDistance = toRadians(destinationLatitude - originLatitude);
  const lngDistance = toRadians(destinationLongitude - originLongitude);

  const originLatRad = toRadians(originLatitude);
  const destinationLatRad = toRadians(destinationLatitude);
  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(originLatRad) *
      Math.cos(destinationLatRad) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);

  const distanceKm =
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return Math.max(1, (distanceKm / AVERAGE_DRIVER_SPEED_KMH) * 60);
};

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      ...driver,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      id: driver.id ?? driver.driver_id ?? Math.floor(Math.random() * 1000),
      price: driver.price ? String(driver.price) : "45000",
      time: driver.time ?? 15,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  // Default Region: Palembang / Sumatera Selatan jika lokasi belum terbaca
  if (!userLatitude || !userLongitude) {
    return {
      latitude: -2.9761,
      longitude: 104.7754,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = Math.max((maxLat - minLat) * 1.3, 0.02);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.3, 0.02);

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  ) {
    return markers;
  }

  const drivers = markers.map((marker) => {
    const timeToUser = estimateTravelMinutes(
      marker.latitude,
      marker.longitude,
      userLatitude,
      userLongitude,
    );
    const timeToDestination = estimateTravelMinutes(
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude,
    );
    const totalTime = Math.ceil(timeToUser + timeToDestination);
    const calculatedPrice =
      Math.round((BASE_FARE + totalTime * PER_MINUTE_RATE) / 1000) * 1000;

    return {
      ...marker,
      time: totalTime,
      price: String(calculatedPrice),
    };
  });

  return drivers.sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
};
