import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import marker from "@/assets/icons/marker.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import selectedMarker from "@/assets/icons/selected-marker.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import getStarted from "@/assets/images/get-started.png";
import message from "@/assets/images/message.png";
import noResult from "@/assets/images/no-result.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import signUpCar from "@/assets/images/signup-car.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  getStarted,
  signUpCar,
  check,
  noResult,
  message,
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  marker,
  out,
  person,
  pin,
  point,
  profile,
  search,
  selectedMarker,
  star,
  target,
  to,
};

export const onboarding = [
  {
    id: 1,
    title: "The perfect ride is just a tap away!",
    description:
      "Your journey begins with Ryde. Find your ideal ride effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Best car in your hands with Ryde",
    description:
      "Discover the convenience of finding your perfect ride with Ryde",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Your ride, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};

export const recentRides = [
  {
    ride_id: "1",
    origin_address: "Palembang, Sumatera Selatan",
    destination_address: "Indralaya, Sumatera Selatan",
    origin_latitude: "-2.976074",
    origin_longitude: "104.775429",
    destination_latitude: "-3.241838",
    destination_longitude: "104.647472",
    ride_time: 82,
    fare_price: "45000.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "1",
    created_at: "2026-08-08 05:19:20.620007",
    driver: {
      driver_id: "2",
      first_name: "Andi",
      last_name: "Pratama",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.60",
    },
  },

  {
    ride_id: "2",
    origin_address: "Palembang, Sumatera Selatan",
    destination_address: "Banyuasin, Sumatera Selatan",
    origin_latitude: "-2.976074",
    origin_longitude: "104.775429",
    destination_latitude: "-2.890833",
    destination_longitude: "104.702222",
    ride_time: 95,
    fare_price: "55000.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2026-08-08 06:12:17.683046",
    driver: {
      driver_id: "1",
      first_name: "Budi",
      last_name: "Santoso",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },

  {
    ride_id: "3",
    origin_address: "Jakarta, Indonesia",
    destination_address: "Bogor, Jawa Barat",
    origin_latitude: "-6.208763",
    origin_longitude: "106.845599",
    destination_latitude: "-6.597147",
    destination_longitude: "106.806039",
    ride_time: 91,
    fare_price: "75000.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2026-08-08 08:49:01.809053",
    driver: {
      driver_id: "1",
      first_name: "Budi",
      last_name: "Santoso",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },

  {
    ride_id: "4",
    origin_address: "Bandung, Jawa Barat",
    destination_address: "Cimahi, Jawa Barat",
    origin_latitude: "-6.917464",
    origin_longitude: "107.619123",
    destination_latitude: "-6.872222",
    destination_longitude: "107.5425",
    ride_time: 47,
    fare_price: "35000.00",
    payment_status: "paid",
    driver_id: 3,
    user_id: "1",
    created_at: "2026-08-08 18:43:54.297838",
    driver: {
      driver_id: "3",
      first_name: "Rizky",
      last_name: "Kurniawan",
      profile_image_url:
        "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
      car_image_url:
        "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
      car_seats: 4,
      rating: "4.70",
    },
  },
];

export const drivers = [
  {
    id: "1",
    first_name: "Budi",
    last_name: "Santoso",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: "4.80",
    price: "45000",
    time: 15,
  },
  {
    id: "2",
    first_name: "Andi",
    last_name: "Pratama",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    car_seats: 5,
    rating: "4.60",
    price: "55000",
    time: 20,
  },
  {
    id: "3",
    first_name: "Rizky",
    last_name: "Kurniawan",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: "4.70",
    price: "35000",
    time: 10,
  },
  {
    id: "4",
    first_name: "Dewi",
    last_name: "Lestari",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: "4.90",
    price: "50000",
    time: 18,
  },
];
