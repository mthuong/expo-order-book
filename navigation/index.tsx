import { Stack } from "expo-router";

function RootNavigation() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' />
    </Stack>
  );
}

export default RootNavigation;
