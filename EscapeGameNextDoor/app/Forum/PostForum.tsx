import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView} from "react-native";
import { TextInput, Modal, Avatar, Card, Menu, Divider, Button  } from "react-native-paper";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams, useRouter } from "expo-router";
import { GetPostForumDto } from "@/interfaces/PublicationInterface/Post/getPostForumDto";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";
import { RemoveHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/removeHasLikeDto";
import { AddHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/addHasLikeDto";
import { GetlikeDto } from "@/interfaces/PublicationInterface/Haslike/getlikes";
import { AddPostForumDto } from '@/interfaces/PublicationInterface/Post/addPostForumDto';
import { GetUserDto } from '@/interfaces/User/GetUserDto';
import PostItem, { PostsList } from './PostItem';
import { AlignJustify } from 'react-native-feather';

const PAGE_SIZE = 5;

export default function PostForum() {
  const { id, forumid } = useLocalSearchParams<{ id: string, forumid: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const action = new UnitofAction();
  const notif = useToasted();

  // State management
  const [postParent, setPostParent] = useState<GetPostForumDto | null>(null);
  const [postMessages, setPostMessages] = useState<GetPostForumDto[]>([]);
  const [currentUser, setCurrentUser] = useState<GetUserDto | null>(null);
  const [typeLikes, setTypeLikes] = useState<GetTypeLikeDto[]>([]);
  const [numberofLike, setNumberofLike] = useState<GetlikeDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [visibleUserMenu, setVisibleUserMenu] = useState(false);
  const [visiblePostMenu, setVisiblePostMenu] = useState(false);

  const [addPost, setAddPost] = useState<AddPostForumDto>({
    content: '',
    forumId: 0,
    postparentId: Number(id),
    userId: 0,
  });

  const fetchData = async () => {
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
  };
  const fetchpostparent=async ()=> {

    const response = await action.postAction.getPostsFromPostParentId(Number(id), page, PAGE_SIZE)
    if(response.Success)
    {
      setPostMessages(response.Data as GetPostForumDto[]);
    }
    else{
      setError(response.Message)
    }
  }
  const fetchUser = async () => {
    try {
      const response = await action.userAction.GetUserById(Number(id));
      if (response.Success) {
        setCurrentUser(response.Data as GetUserDto);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération de l'utilisateur:", err);
    }
  };

  const fetchNumberOfLikes = async () => {
    try {
      const response = await action.postAction.GetlikeToForum(Number(id));
      if (response.Success) {
        setNumberofLike(response.Data as GetlikeDto);
      }
    } catch (err) {
      console.log("Erreur lors de la récupération des likes:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchData();
    }
  }, [page, id]);


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
      userId: user?.id || 0,
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
        fetchpostparent();
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

  const handleLike = async (typeId: 1 | 2) => {
    if (!postParent) return;
    
    setLoadingLike(true);
    try {
      const likeDto: AddHasLikeDto = {
        forumId: postParent.id,
        typeLikeId: typeId,
      };

      const response = await action.postAction.AddlikeToForum(likeDto);
      if (response.Success) {
        setLiked(typeId === 1);
        fetchNumberOfLikes();
        notif.showToast(typeId === 1 ? "Like ajouté" : "Like retiré", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (err) {
      notif.showToast("Erreur lors de l'action", "error");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleDelete = async () => {
    // Implementation for delete functionality
    console.log("Delete post functionality to be implemented");
  };

  const getTotalLikes = () => {
    if (!numberofLike?.getAllThelikes) return 0;
    return numberofLike.getAllThelikes.reduce((total, like) => 
      total + (like.numberLikes || 0), 0
    );
  };

  const renderUserAvatar = (userData: GetUserDto | null) => {
    return userData?.picture ? (
      <Avatar.Image source={{ uri: userData.picture }} size={40} />
    ) : (
      <Avatar.Icon icon="account" size={40} style={styles.defaultAvatar} />
    );
  };

  const isOwner = postParent && user && postParent.userId === user.id;

  // Error handling for missing parameters
  if (!id || !forumid) {
    return (
      <AppView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur : Identifiants manquants</Text>
          <Text>ID: {id}</Text>
          <Text>Forum ID: {forumid}</Text>
          <Button onPress={() => router.back()}>Retour</Button>
        </View>
      </AppView>
    );
  }

  // Loading state
  if (isLoading && !postParent) {
    return (
      <AppView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </AppView>
    );
  }

  // Error state
  if (error && !postParent) {
    return (
      <AppView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={fetchData}
            style={styles.retryButton}
          >
            Réessayer
          </Button>
        </View>
      </AppView>
    );
  }

  return (
    <AppView>
      <View style={styles.pageContainer}>
        <ScrollView style={styles.container}>
          {postParent ? (
            <Card style={styles.postCard}>
              <Card.Title
                title={`Post #${postParent.id}`}
                subtitle={`Par ${currentUser?.username || 'Utilisateur'}`}
                left={() => renderUserAvatar(currentUser)}
                right={() => (
                  <View style={styles.headerActions}>
                    <Menu
                      visible={visibleUserMenu}
                      onDismiss={() => setVisibleUserMenu(false)}
                      anchor={
                        <Button 
                          mode="text" 
                          onPress={() => setVisibleUserMenu(true)}
                          icon="account"
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setVisibleUserMenu(false);
                          router.push({
                            pathname: "/Signalement/SignalementUser",
                            params: { id: postParent.id.toString() }
                          });
                        }}
                        title="Signaler l'utilisateur"
                      />
                      <Divider />
                      {isOwner && (
                        <Menu.Item onPress={handleDelete} title="Supprimer" />
                      )}
                    </Menu>

                    <Menu
                      visible={visiblePostMenu}
                      onDismiss={() => setVisiblePostMenu(false)}
                      anchor={
                        <Button 
                          mode="text" 
                          onPress={() => setVisiblePostMenu(true)}
                          icon={() => <AlignJustify />}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setVisiblePostMenu(false);
                          router.push({
                            pathname: "/Signalement/SignalementForum",
                            params: { id: postParent.id.toString() },
                          });
                        }}
                        title="Signaler le post"
                      />
                    </Menu>
                  </View>
                )}
              />
              
              <Card.Content>
                <Text style={styles.postContent}>
                  {postParent.content}
                </Text>
                
                {numberofLike && (
                  <View style={styles.likeSection}>
                    <Text style={styles.likeText}>
                      {getTotalLikes()} like(s)
                    </Text>
                  </View>
                )}
              </Card.Content>

              <Card.Actions style={styles.postActions}>
                <Button
                  loading={loadingLike}
                  onPress={() => handleLike(liked ? 2 : 1)}
                  mode={liked ? "outlined" : "contained"}
                  style={styles.likeButton}
                >
                  {liked ? "Retirer Like" : "Like"}
                </Button>
                
                <Button 
                  onPress={() => setIsModalVisible(true)} 
                  mode="outlined" 
                  icon="reply"
                >
                  Répondre
                </Button>
              </Card.Actions>
            </Card>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </ScrollView>
        
        {/* Replies Section */}
        <View style={styles.repliesContainer}>
          {postParent ? (
            <PostsList 
              postForumId={Number(id)}
              page={page}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
        </View>
        
        {/* Add Post Modal */}
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
              <Button
                mode="outlined"
                onPress={() => setIsModalVisible(false)}
                disabled={isSubmitting}
                style={styles.modalButton}
              >
                Annuler
              </Button>
              <Button
                mode="contained"
                onPress={handleAddPost}
                loading={isSubmitting}
                disabled={isSubmitting || !addPost.content.trim()}
                style={styles.modalButton}
              >
                Publier
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </View>
    </AppView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 120, // Adjust as needed
  },
    pageContainer:
  {
    alignSelf:'center',
    maxWidth:800,
    width:"100%",
    paddingHorizontal:16
  },
  scrollView: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    marginRight: 8,
  },
  addButtonContainer: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContainer: {
    flexDirection: "column",
  },
  backButton: {
    margin: 0,
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
  },  modalContainer: {
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    padding: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    resizeMode: 'contain',
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
