import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { UnitofAction } from "@/action/UnitofAction";
import { GetForumDto } from "@/interfaces/PublicationInterface/Forum/getForumDto";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Divider, List } from "react-native-paper";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";
import { AddHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/addHasLikeDto";
import { RemoveHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/removeHasLikeDto";
import { GetPostForumDto } from "@/interfaces/PublicationInterface/Post/getPostForumDto";
import { GetlikeDto } from "@/interfaces/PublicationInterface/Haslike/getlikes";
import { ThemedText } from "@/components/ThemedText";
const PAGE_SIZE = 5;

const Forum = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [forum, setForum] = useState<GetForumDto | null>(null);
  const [typeLike, setTypeLike] = useState<GetTypeLikeDto[]>([]);
  const [postMessage, setPostMessage] = useState<GetPostForumDto[]>([]);
   const [numberofLike, setNumberofLike] = useState<GetlikeDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notif = useToasted();
  const router = useRouter();
  const action = new UnitofAction();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [forumResponse, postResponse, typeLikeResponse] = await Promise.all([
        action.forumAction.getForumById(Number(id)),
        action.postAction.getPostsByForumId(Number(id), page, PAGE_SIZE),
        action.forumAction.GetTypeLIke()
      ]);

      if (forumResponse.Success) {
        setForum(forumResponse.Data as GetForumDto);
      } else {
        setError(forumResponse.Message);
      }

      if ((postResponse as PaginationResponse<GetPostForumDto>).Success) {
        const paginatedResponse = postResponse as PaginationResponse<GetPostForumDto>;
        setPostMessage(paginatedResponse.Data as GetPostForumDto[]);
        setTotalPage(paginatedResponse.TotalPage);
      }
 
      if ((typeLikeResponse as ServiceResponse<GetTypeLikeDto[]>).Success ) {
        setTypeLike((typeLikeResponse ).Data as GetTypeLikeDto[] );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

 const handleLike = async (postId: number) => {
    try {
      // You need to define typeLikeId - this seems to be missing
      const typeLikeId = 1; // Replace with actual logic to get typeLikeId
      
      const addLikeDto: AddHasLikeDto = {
        forumId: postId, // Use postId instead of forum id
        typeLikeId,
      };
      
      const response = await action.forumAction.AddlikeToForum(addLikeDto);
      if (response.Success) {
        fetchData();
        notif.showToast("Like ajouté", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } 
    catch (err) {
      notif.showToast("Erreur lors de l'ajout du like", "error");
    }
  };

  const handleDisLike = async (postId: number) => {
    try {
      // You need to define typeLikeId - this seems to be missing
      const typeLikeId = 1; // Replace with actual logic to get typeLikeId
      
      const removeLikeDto: RemoveHasLikeDto = {
        forumId: postId, // Use postId instead of forum id
        typeLikeId
      };
      
      const response = await action.forumAction.RemovelikeToForum(removeLikeDto);
      if (response.Success) {
        fetchData();
        notif.showToast("Like retiré", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } 
    catch (err) {
      notif.showToast("Erreur lors de la suppression du like", "error");
    }
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
  const getTotalLikes = () => {
    if (!numberofLike?.getAllThelikes) return 0;
    return numberofLike.getAllThelikes.reduce((total, like) => 
      total + (like.numberLikes || 0), 0
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage || isLoading) return;
    setPage(newPage);
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
          <Card.Title title={forum?.title} />
          <Card.Content>
            <View style={styles.postsContainer}>
              {postMessage.map((item) => (
                <View key={item.id} style={styles.postContainer}>
                  <Card 
                    onPress={() => router.push({
                      pathname: "/Forum/PostForum",
                      params: { id: item.id }
                    })}
                  >
                    <Card.Title
                      title={`Post #${item.id}`}
                      right={() => <ThemedText>{FormUtils.FormatDate(item.creationDate)}</ThemedText>}
                    />
                    <Card.Content>
                      <List.Item
                        title={item.content || "Pas de contenu"}
                        description={`Par ${item.userId}`}
                        left={props => <List.Icon {...props} icon="account" />}
                      />
                    </Card.Content>
                    <Card.Actions>
                      <View style={{flex:1}}>
                         <View style={styles.likeContainer}>
                                 <Text style={styles.likeText}>Nombre de likes: {getTotalLikes()}</Text>
                          </View>
                      <Button onPress={() => handleLike(item.id)}>Like</Button>
                      <Button onPress={() => handleDisLike(item.id)}>Dislike</Button>

                      </View>
                    </Card.Actions>
                  </Card>
                  <Divider />
                </View>
              ))}
            </View>
          </Card.Content>
          <Card.Actions style={styles.paginationContainer}>
            <View>
              <View style={{flex:1}}>

              <Button 
                disabled={page === 1 || isLoading}
                onPress={() => handlePageChange(page - 1)}
              >
                Précédent
              </Button>
              <ThemedText style={styles.pageText}>Page {page}/{totalPage}</ThemedText>
              <Button
                disabled={page === totalPage || isLoading}
                onPress={() => handlePageChange(page + 1)}
              >
                Suivant
              </Button>
              </View>
            </View>
          </Card.Actions>
        </Card>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  postsContainer: {
    gap: 16,
  },
  postContainer: {
    marginBottom: 8,
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
  },
  likeContainer: {
    marginBottom: 8,
  },
  likeText: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Forum;