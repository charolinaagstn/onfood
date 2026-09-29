const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "";

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    ...(googleMapsApiKey
      ? [
          [
            "react-native-maps",
            {
              androidGoogleMapsApiKey: googleMapsApiKey,
            },
          ],
        ]
      : []),
  ],
});

