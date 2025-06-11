import { ActivityIndicator } from 'react-native';
import { Stack } from '@mui/material';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/ContextHook/AuthContext';
import AppView from '@/components/ui/AppView';
import LatestEscapeGames from '../IndexeComponent/latestEscapeGames';
import TopEscapeGames from '../IndexeComponent/TopEscapeGames';
import LatestEscapeGamesNoted from '../IndexeComponent/LatestEscapeGameNoted';
import RecommandedEscapeGames from '../IndexeComponent/RecommandedEscapeGames';

export default function HomeScreen() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <AppView>
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  return (
    <AppView >

          <ThemedText type="title">Welcome!</ThemedText>
      <Stack>
        <ThemedView style={{ flex: 1 }}>
          <ThemedText>Heureux de vous revoir {user?.username || 'Guest'}</ThemedText>

        </ThemedView>
        <ThemedView>

        <LatestEscapeGames />
        </ThemedView>
        <ThemedView>
          <LatestEscapeGamesNoted />

        </ThemedView>
          <ThemedView>
          <RecommandedEscapeGames />

          </ThemedView>
          <ThemedView>
            <TopEscapeGames />
          </ThemedView>
      </Stack>
    </AppView>
  );
}
