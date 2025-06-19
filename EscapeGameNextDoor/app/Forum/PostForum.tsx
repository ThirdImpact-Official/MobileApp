import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Divider, List } from "react-native-paper";
import { GetPostForumDto } from "@/interfaces/PublicationInterface/Post/getPostForumDto";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";
import { RemoveHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/removeHasLikeDto";
import { AddHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/addHasLikeDto";
import { GetlikeDto, LikesDto } from "@/interfaces/PublicationInterface/Haslike/getlikes";
import { ThemedText } from "@/components/ThemedText";
const PAGE_SIZE = 5;

export default function PostForum() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [postParent, setPostParent] = useState<GetPostForumDto | null>(null);
  const [postMessages, setPostMessages] = useState<GetPostForumDto[]>([]);
  const [typeLikes, setTypeLikes] = useState<GetTypeLikeDto[]>([]);
  const [numberofLike, setNumberofLike] = useState<GetlikeDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notif = useToasted();
  const router = useRouter();
  const action = new UnitofAction();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [parentResponse, postsResponse] = await Promise.all([
        action.postAction.getPostById(Number(id)),
        action.postAction.getPostsFromPostParentId(Number(id), page, PAGE_SIZE)
      ]);

      if (parentResponse.Success) {
        setPostParent(parentResponse.Data as GetPostForumDto);
      } else {
        setError(parentResponse.Message);
      }

      if ((postsResponse as PaginationResponse<GetPostForumDto>).Success) {
        const paginatedResponse = postsResponse as PaginationResponse<GetPostForumDto>;
        setPostMessages(paginatedResponse.Data as GetPostForumDto[]);
        setTotalPages(paginatedResponse.TotalPage);
      }

      // Fetch number of likes
      await fetchNumberOfLikes();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      notif.showToast("Erreur réseau", "error");
    } finally {
      setIsLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isLoading) return;
    setPage(newPage);
  };

  const fetchNumberOfLikes = async () => {
    try {
      const response = await action.postAction.GetlikeToForum(Number(id));
      if (response.Success) {
        setNumberofLike(response.Data as GetlikeDto);
      } else {
        console.log("Erreur lors de la récupération des likes:", response.Message);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération des likes:", err);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      // You need to define typeLikeId - this seems to be missing
      const typeLikeId = 1; // Replace with actual logic to get typeLikeId
      
      const addLikeDto: AddHasLikeDto = {
        forumId: postId, // Use postId instead of forum id
        typeLikeId,
      };
      
      const response = await action.postAction.AddlikeToForum(addLikeDto);
      if (response.Success) {
        fetchData();
        notif.showToast("Like ajouté", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (err) {
      notif.showToast("Erreur lors de l'ajout du like", "error");
    }
  };

  const getTotalLikes = () => {
    if (!numberofLike?.getAllThelikes) return 0;
    return numberofLike.getAllThelikes.reduce((total, like) => 
      total + (like.numberLikes || 0), 0
    );
  };

  const handleDisLike = async (postId: number) => {
    try {
      // You need to define typeLikeId - this seems to be missing
      const typeLikeId = 1; // Replace with actual logic to get typeLikeId
      
      const removeLikeDto: RemoveHasLikeDto = {
        forumId: postId, // Use postId instead of forum id
        typeLikeId
      };
      
      const response = await action.postAction.RemovelikeToForum(removeLikeDto);
      if (response.Success) {
        fetchData();
        notif.showToast("Like retiré", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (err) {
      notif.showToast("Erreur lors de la suppression du like", "error");
    }
  };

  if (isLoading) {
    return (
      <AppView>
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  if (error) {
    return (
      <AppView>
        <Card style={styles.container}>
          <Card.Title title="Erreur" />
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={fetchData}>Réessayer</Button>
          </Card.Actions>
        </Card>
      </AppView>
    );
  }

  return (
    <AppView>
      <ScrollView>
        <Card style={styles.container}>
          <Card.Title title={`Réponses (${postMessages.length})`} />
          
          {/* Post parent */}
          {postParent && (
            <>
              <Card style={styles.postCard}>
                <Card.Title
                  title={`Post #${postParent.id}`}
                  subtitle={`Posté le ${FormUtils.FormatDate(postParent.creationDate)}`}
                />
                <Card.Content>
                  <ThemedText style={styles.postContent}>{postParent.content}</ThemedText>
                </Card.Content>
                <Card.Actions>
                  <View style={{flex:1}}>
                  <View style={styles.likeContainer}>
                    <Text style={styles.likeText}>Nombre de likes: {getTotalLikes()}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button onPress={() => handleLike(postParent.id)}>Like</Button>
                    <Button onPress={() => handleDisLike(postParent.id)}>Dislike</Button>
                  </View>

                  </View>
                </Card.Actions>
              </Card>
              <Divider style={styles.divider} />
            </>
          )}

          {/* Réponses */}
          <Card.Content>
            {postMessages.map((item) => (
              <View key={item.id} style={styles.postContainer}>
                <Card style={styles.postCard}>
                  <Card.Title
                    title={`Réponse #${item.id}`}
                    subtitle={`Posté le ${FormUtils.FormatDate(item.creationDate)}`}
                  />
                  <Card.Content>
                    <Text style={styles.postContent}>{item.content}</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => handleLike(item.id)}>Like</Button>
                    <Button onPress={() => handleDisLike(item.id)}>Dislike</Button>
                  </Card.Actions>
                </Card>
                <Divider style={styles.divider} />
              </View>
            ))}
          </Card.Content>

          {/* Pagination */}
          <Card.Actions style={styles.paginationContainer}>
            <View style={{flex:1}}>
              <Button 
                disabled={page === 1 || isLoading}
                onPress={() => handlePageChange(page - 1)}
              >
                Précédent
              </Button>
              <ThemedText style={styles.pageText}>Page {page}/{totalPages}</ThemedText>
              <Button
                disabled={page === totalPages || isLoading}
                onPress={() => handlePageChange(page + 1)}
              >
                Suivant
              </Button>

            </View>
          </Card.Actions>
        </Card>
      </ScrollView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  postContainer: {
    marginBottom: 16,
  },
  postCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  pageText: {
    fontSize: 16,
    textAlign: "center"
  },
  likeContainer: {
    marginBottom: 8,
  },
  likeText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});