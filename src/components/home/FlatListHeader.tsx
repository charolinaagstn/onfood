import type { UserResource } from "@clerk/expo/types";

const FlatListHeader = ({
  user,
  handleSignOut,
  handleDestinationPress,
}: {
  user: UserResource | null | undefined;
  handleSignOut: () => void;
  handleDestinationPress: () => string;
}) => {
  return null;
};

export default FlatListHeader;
