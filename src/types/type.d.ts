import { TextInputProps, TouchableOpacityProps } from "react-native";

export declare interface Driver {
  id?: string | number;
  driver_id?: number | string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number | string;
  price?: string | number;
  time?: number;
}

export declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: number | string;
  title: string;
  profile_image_url: string;
  car_image_url: string;
  car_seats: number;
  rating: number | string;
  first_name: string;
  last_name: string;
  time?: number;
  price?: string | number;
}

export declare interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: number | null;
  onMapReady?: () => void;
}

export declare interface Ride {
  ride_id?: string;
  origin_address: string;
  destination_address: string;
  origin_latitude: number | string;
  origin_longitude: number | string;
  destination_latitude: number | string;
  destination_longitude: number | string;
  ride_time: number;
  fare_price: number | string;
  payment_status: string;
  driver_id: number | string;
  user_id?: string;
  user_email?: string;
  created_at: string;
  driver: {
    driver_id?: number | string;
    first_name: string;
    last_name: string;
    profile_image_url?: string;
    car_image_url?: string;
    car_seats: number;
    rating?: string | number;
  };
}

export declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

export declare interface GoogleInputProps {
  icon?: string | any;
  initialLocation?: string;
  containerStyle?: string;
  inputContainerStyle?: string;
  inputStyle?: string;
  multilineInput?: boolean;
  inputNumberOfLines?: number;
  autoGrowInput?: boolean;
  minInputHeight?: number;
  maxInputHeight?: number;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export declare interface PlacesInputProps extends GoogleInputProps {}

export declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export declare interface PaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  driverId?: number;
  rideTime?: number;
  buttonClassName?: string;
  onSuccess?: (orderId: string) => void | Promise<void>;
  onError?: (errorMessage: string) => void;
}

export declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

export declare interface DriverCardProps {
  item: MarkerData;
  selected: number;
  setSelected: () => void;
}
