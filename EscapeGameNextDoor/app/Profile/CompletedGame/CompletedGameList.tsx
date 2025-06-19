import { GetEscapeGameDto } from '../../../interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { useState, useEffect } from 'react';
import { UnitofAction } from '@/action/UnitofAction';
import AppView from '@/components/ui/AppView';
import { Card, ActivityIndicator, Text } from 'react-native-paper';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { View } from 'react-native';
export default function CompletedList() {
    const [completedGames, setCompletedGames] = useState<GetEscapeGameDto[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const action = new UnitofAction();

    useEffect(() => {
        const fetchCompletedGames = async () => {
            try {
                const response = await action.escapeGameAction.getCompletedGames();
                if (response.Success) {
                    setCompletedGames(response.Data);
                } else {
                    setError(response.Message);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCompletedGames();
    }, []);

    if (isLoading) {
        return (
            <AppView>
                <Card>
                    <Card.Title title="Loading">
                    </Card.Title>
                    <Card.Content>
                        <View>
                            <ActivityIndicator />
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    if (error) {
        return (
            <AppView>
                <Card>
                    <Card.Title title="Error">
                    </Card.Title>
                    <Card.Content>
                        <View>
                            <Text>{error}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card>
                <Card.Title title="Completed Games">
                </Card.Title>
                <Card.Content>
                    <View>
                        {completedGames?.map((game) => (
                            <ItemDisplay key={game.Id} item={game} />
                        ))}
                    </View>
                </Card.Content>
            </Card>
        </AppView>
    );
}
