import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { TextInput, Modal, Avatar, Button, Card, Divider, List,Surface, IconButton } from "react-native-paper";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams, useRouter } from "expo-router";
import { GetPostForumDto } from "@/interfaces/PublicationInterface/Post/getPostForumDto";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";
import { RemoveHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/removeHasLikeDto";
import { AddHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/addHasLikeDto";
import { GetlikeDto, LikesDto } from "@/interfaces/PublicationInterface/Haslike/getlikes";
import { ThemedText } from "@/components/ThemedText";
import { AddPostForumDto } from '@/interfaces/PublicationInterface/Post/addPostForumDto';
import { GetUserDto } from '@/interfaces/User/GetUserDto';
import { PlusCircle} from 'react-native-feather';
import {PostItem,PostsList} from './PostItem';

const PAGE_SIZE = 5;

export default function PostForum() {
  const { id, forumid } = useLocalSearchParams<{ id: string, forumid: string }>();
  const [postParent, setPostParent] = useState<GetPostForumDto | null>(null);
  const [postMessages, setPostMessages] = useState<GetPostForumDto[]>([]);
  const [getuser, setUser] = useState<GetUserDto | null>(null);
  const [typeLikes, setTypeLikes] = useState<GetTypeLikeDto[]>([]);
  const [numberofLike, setNumberofLike] = useState<GetlikeDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const notif = useToasted();
  const router = useRouter();
  const action = new UnitofAction();

  const [addPost, setAddPost] = useState<AddPostForumDto>({
    content: '',
    forumId: 0,
    postparentId: Number(id),
    userId: 0,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const [parentResponse, postsResponse] = await Promise.all([
        action.postAction.getPostById(Number(id)),
        action.postAction.getPostsFromPostParentId(Number(id), page, PAGE_SIZE)
      ]);

      if (parentResponse.Success) {
        console.log(parentResponse.Data);
        setPostParent(parentResponse.Data as GetPostForumDto);
      } else {
        setError(parentResponse.Message);
      }

      if ((postsResponse as PaginationResponse<GetPostForumDto>).Success) {
        const paginatedResponse = postsResponse as PaginationResponse<GetPostForumDto>;
        setPostMessages(paginatedResponse.Data as GetPostForumDto[]);
        setTotalPages(paginatedResponse.TotalPage);
      }

      await fetchNumberOfLikes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      notif.showToast("Erreur réseau", "error");
    } finally {
      setIsLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchUser();
    fetchData();
  }, [fetchData]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await action.userAction.GetUserById(Number(id));
      if (response.Success) {
        setUser(response.Data as GetUserDto);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération de l'utilisateur:", err);
    }
    finally
    {
      setIsLoading(false);
    }
  };

  const fetchNumberOfLikes = async () => {
    try {
      setIsLoading(true);
      const response = await action.postAction.GetlikeToForum(Number(id));
      if (response.Success) {
        setNumberofLike(response.Data as GetlikeDto);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération des likes:", err);
    }
      finally
    {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!addPost.content.trim()) {
      notif.showToast("Le contenu ne peut pas être vide", "error");
      return;
    }

    setIsSubmitting(true);
    const postData = {
      ...addPost,
      forumId: Number(forumid),
      content: addPost.content.trim(),
    };

    try {
      const response = await action.postAction.createPostForPostParent(
        Number(id),
        postData
      ) as ServiceResponse<GetPostForumDto>;

      if (response.Success) {
        notif.showToast("Post ajouté avec succès", "success");
        setAddPost({ ...addPost, content: '' });
        setIsModalVisible(false);
        fetchData();
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (err) {
      notif.showToast("Erreur lors de l'ajout du post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isLoading) return;
    setPage(newPage);
  };

  const handleLike = async (postId: number) => {
    try {
      const typeLikeId = 1;
      const addLikeDto: AddHasLikeDto = {
        forumId: postId,
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

  const handleDisLike = async (postId: number) => {
    try {
      const typeLikeId = 2;
      const removeLikeDto: RemoveHasLikeDto = {
        forumId: postId,
        typeLikeId
      };

      const response = await action.postAction.AddlikeToForum(removeLikeDto);
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

  const getTotalLikes = () => {
    if (!numberofLike?.getAllThelikes) return 0;
    return numberofLike.getAllThelikes.reduce((total, like) => 
      total + (like.numberLikes || 0), 0
    );
  };

  const renderUserAvatar = (user: GetUserDto | null) => {
    return user?.picture ? (
      <Avatar.Image source={{ uri: user.picture }} size={40} />
    ) : (
      <Avatar.Icon icon="account" size={40} style={styles.defaultAvatar} />
    );
  };
  

  if(id && !postParent) {
    return (
      <AppView >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </AppView>
    )
  }
 
  if (isLoading && !postParent) {
    return (
      <AppView >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </AppView>
    );
  }

  if (error && !postParent) {
    return (
      <AppView >
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchData}
          style={styles.retryButton}
        >
          Réessayer
        </Button>
      </AppView>
    );
  }

  return (
    <AppView >
    <ScrollView style={styles.container}>
      
       <PostItem post={postParent as GetPostForumDto} isForum={true} refreshPosts={fetchData} />
       
      </ScrollView>
      {/* Add Post Modal */}
      <View>
        <PostsList 
       
          postForumId={Number(id)}
          page={page}
        />
      </View>
      <Modal
        visible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Title 
            title="Ajouter une réponse" 
            titleStyle={styles.modalTitle}
          />
          
          <Card.Content>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={addPost.content}
              placeholder="Écrivez votre réponse..."
              onChangeText={(text) => setAddPost(prev => ({ ...prev, content: text }))}
              style={styles.textInput}
              disabled={isSubmitting}
            />
          </Card.Content>
          
          <Card.Actions style={styles.modalActions}>
            <View style={{flex:1}}>
              <Button
                mode="outlined"
                onPress={() => setIsModalVisible(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                mode="contained"
                onPress={handleAddPost}
                loading={isSubmitting}
                disabled={isSubmitting || !addPost.content.trim()}
              >
                Publier
              </Button>

            </View>
          </Card.Actions>
        </Card>
      </Modal>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  backButton: {
    margin: 0,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  
  mainDivider: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 4,
  },
  headerContainer: {
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  titleSection: {
    marginLeft: 12,
    flexShrink: 1,
  },
  username: {
    fontSize: 14,
    color: "#777",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
    color: "#222",
  },
  content: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  replyIcon: {
    marginRight: 6,
    color: "#2196F3",
  },
  replyText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  addButton: {
    margin: 0,
  },
  
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  
  postSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginTop: 8,
  },
  
  likeSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  
  likeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  postActions: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  
  likeButton: {
    margin: 0,
    marginRight: 8,
  },
  
  dislikeButton: {
    margin: 0,
  },
  
  defaultAvatar: {
    backgroundColor: '#e9ecef',
  },
  
  mainDivider: {
    marginVertical: 16,
    marginHorizontal: 16,
    backgroundColor: '#dee2e6',
    height: 2,
  },
  
  repliesContainer: {
    paddingBottom: 20,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginTop: 16,
  },
  
  paginationButton: {
    minWidth: 100,
  },
  
  pageIndicator: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  
  modalContainer: {
     flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Optional: adds a semi-transparent background
    margin: 0
  },
  
  modalCard: {
     width: '90%', // Set a width that works for your design
    maxWidth: 500, // Optional: set a maximum width
    padding: 20,
  
    borderRadius: 12,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  textInput: {
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  
  modalActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  
  retryButton: {
    marginTop: 16,
  },
});