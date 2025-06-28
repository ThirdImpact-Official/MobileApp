import React, { FC, useCallback, useEffect, useState } from "react";

import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, } from "react-native";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { UnitofAction } from "@/action/UnitofAction";
import { GetForumDto } from "@/interfaces/PublicationInterface/Forum/getForumDto";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Card, Divider, List, Modal, TextInput, Surface,IconButton,Avatar,Menu } from 'react-native-paper';
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";
import { AddHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/addHasLikeDto";
import { RemoveHasLikeDto } from "@/interfaces/PublicationInterface/Haslike/removeHasLikeDto";
import { GetPostForumDto } from "@/interfaces/PublicationInterface/Post/getPostForumDto";
import { GetlikeDto } from "@/interfaces/PublicationInterface/Haslike/getlikes";
import { ThemedText } from "@/components/ThemedText";
import ModalComponent from "@/components/factory/GenericComponent/RenderDetails";
import { Circle, PlusCircle } from "react-native-feather";
import { ClipPath } from "react-native-svg";
import { ResponseAdminDemandDto } from '../../interfaces/AdminDemand/ResponseAdminDemand';
import { AddPostForumDto } from '../../interfaces/PublicationInterface/Post/addPostForumDto';
import { GetUserDto } from '@/interfaces/User/GetUserDto';
import renderer from 'react-test-renderer';
import PostItem from "./PostItem";
import PostsList from "./PostItem";
import { AlignJustify } from "react-native-feather";
const PAGE_SIZE = 5;

export default function Forum() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [forum, setForum] = useState<GetForumDto | null>(null);
  const [typeLike, setTypeLike] = useState<GetTypeLikeDto[]>([]);
  const [postMessage, setPostMessage] = useState<GetPostForumDto[]>([]);
  const [numberofLike, setNumberofLike] = useState<GetlikeDto | null>(null);
  const [user, setUser] = useState<GetUserDto | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notif = useToasted();
  const router = useRouter();
  const action = new UnitofAction();
  //--menu
   const [visible, setVisible] = React.useState(false);
  const forumId = id ? Number(id) : 0; // ou une valeur par défaut appropriée
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  //---forum partt
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addForum, setAddForum] = useState<AddPostForumDto>({
    content: '',
    forumId: forumId,
    postparentId: null,
    userId: 0,
  });
   const [isDeleteModalVisible, setDeleteIsModalVisible] = useState(false);
  const isOwner = String(user?.id) === String(forum?.userId);

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

      if ((typeLikeResponse as ServiceResponse<GetTypeLikeDto[]>).Success) {
        setTypeLike((typeLikeResponse).Data as GetTypeLikeDto[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    fetchData();
    fetchNumberOfLikes();
  }, []);
/**
 * 
 * @param id 
 * @param isforum 
 */
 const hasCurrentuserlike=async (id:number,isforum:boolean): boolean => {
    const response = isforum ?await action.forumAction.Verifylike(id):await action.postAction.Verifylike(id);
    if(response.Success){
      return true;
    }
  }  
  const handlePostLike=  async (postId: number) => {
    try {
      const typeLikeId = 1;
      const addLikeDto: AddHasLikeDto = {
        forumId: postId,
        typeLikeId,
      };
      const response = await action.forumAction.AddlikeToForum(addLikeDto);
      if (response.Success) {
        fetchData();
        notif.showToast("Like ajouté", "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (err) {
      notif.showToast("Erreur lors de l'ajout du like", "error");
    }
  }
  const handlePostDisLike = async (postId: number) => {
    try {
      const typeLikeId = 2;
      const removeLikeDto: RemoveHasLikeDto = {
        forumId: postId,
        typeLikeId,
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
  }
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
  const fetchUser = async () => {
    const reponse = await action.userAction.GetUserById(forum?.userId as number);
    if (reponse.Success) {
      setUser(reponse.Data as GetUserDto);
    }
  }
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
  const handleContentChange = (text: string) => {
    setAddForum(prev => ({
      ...prev,
      content: text
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage || isLoading) return;
    setPage(newPage);
  };
  {/*addPOstModal */}
  const handleopenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
   {/*addPOstModal */}
  const handleDeleteopenModal = () => setDeleteIsModalVisible(true);
  const handleDeleteCloseModal = () => setDeleteIsModalVisible(false);
  const handlesignalement=()=> {
    router.push({
      pathname: '/Signalement/SignalementForum',
      params: { id: forum?.id },
    });
  }
  const handleAddPost = async () => {

    const forumId:number= Number(id);
    const postData: AddPostForumDto = {
      content: addForum.content.trim(),
      forumId: forumId, // Utilisation directe de l'ID vérifié
      postparentId: addForum.postparentId,
      userId: addForum.userId
    };
    const response: ServiceResponse<GetPostForumDto> = await action.postAction.createPostForForum(forumId, postData) as ServiceResponse<GetPostForumDto>;
    if (response.Success) {

      notif.showToast("Post ajouté", "success");
      handleCloseModal();
      setIsModalVisible(false);
      fetchData();
    }
  };

 const handleDelete=async() => {
        try
        {
          
            const response =await action.forumAction.deleteForum(Number(id));
            if(response.Success){
           
               
            }
        }
        catch
        {
          
        }
    }
  useEffect(() => {
    fetchUser();
  }, [forum]);



  if (isLoading) {
    return (
      <AppView >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </AppView>
    );
  }

  if (error) {
    return (
      <AppView >
        <View style={styles.errorContainer}>
          <Card style={styles.container}>
            <Card.Title title="Erreur" />
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
            </Card.Content>
            <Card.Actions style={{ alignItems: "center", justifyContent: "center", width: "100%", height: "100%", flexDirection: "row", flexWrap: "wrap" }}>
              <View style={{ flex: 1 }}>

                <Button style={styles.retryButton} onPress={fetchData}>Réessayer</Button>
              </View>
            </Card.Actions>
          </Card>
        </View>
      </AppView>
    );
  }

  if (!postMessage.length) {
    return (
      <AppView >
        <View style={styles.pageContainer} >
          <ScrollView  style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}>
            <Card style={styles.header}>
              <Card.Title
                title={forum?.title}
                titleStyle={styles.headerTitle}
                right={(props) => (
                  <View>
                    <View style={[styles.addButtonContainer, { alignSelf: "flex-end" }]}>
                      <PlusCircle onPress={handleopenModal} style={styles.addButton} />
                      <View>
                        <ThemedText>{FormUtils.FormatDate(forum?.creationDate)}</ThemedText>
                      </View>
                    </View>
                  </View>
                )}
              />
              <Card.Content>
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Aucun post disponible</Text>
                  <Text style={styles.emptySubtext}>Soyez le premier à ajouter un post dans ce forum !</Text>
                </View>

              </Card.Content>
            </Card>

          </ScrollView>

          <Modal visible={isModalVisible} onDismiss={handleCloseModal}>
            <View style={styles.modalContainer}>
              <Card style={styles.modalCard}>
                <Card.Title title="Ajouter un post" titleStyle={styles.modalTitle} />
                <Card.Content>
                  <TextInput
                    style={styles.textInput}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    value={addForum.content}
                    placeholder="Contenu"
                    onChangeText={handleContentChange}
                  />
                </Card.Content>
                <Card.Actions style={styles.modalActions}>
                  <Button onPress={handleAddPost}>Ajouter</Button>
                  <Button onPress={handleCloseModal}>Annuler</Button>
                </Card.Actions>
              </Card>
            </View>
          </Modal>
        </View>
      </AppView>
    );
  }

  return (
    <AppView >
      <View style={styles.pageContainer}>

        <ScrollView style={styles.scrollView}>
          <Card style={styles.postCard}>
        <Card.Title
          title={user?.username || 'Utilisateur'}
          subtitle={forum?.title}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="account"
              style={styles.defaultAvatar}
            />
          )}
          right={(props) => (
            <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Button onPress={openMenu}>< AlignJustify/></Button>}>
            <Menu.Item onPress={handlesignalement} title="Signalement" />
            { isOwner && (
              <Menu.Item onPress={handleDeleteopenModal} title="Supprimer" />
            )}
          </Menu>
          )}
        />
        <Card.Content>
          <Text style={styles.content}>{forum?.content}</Text>

          <View style={{ flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,}}>
            <IconButton
              icon="heart-outline"
              size={20}
              onPress={() => handleLike(Number(id))}
              style={styles.likeButton}
            />
            <IconButton
              icon="heart-remove-outline"
              size={20}
              onPress={() => handleDisLike(Number(id))}
              style={styles.dislikeButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.dateText}>
              {FormUtils.FormatDate(forum?.creationDate)}
            </Text>

            <TouchableOpacity onPress={handleopenModal} style={styles.replyButton}>
              <PlusCircle stroke="black" width={16} height={16} style={styles.replyIcon} />
              <Text style={styles.replyText}>Répondre</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

          <View style={styles.repliesContainer}>
            <PostsList forumId={Number(id)} postForumId={0} page={page} />
          </View>

          <View style={styles.paginationContainer}>
            <Button
              mode="outlined"
              style={styles.paginationButton}
              disabled={page === 1 || isLoading}
              onPress={() => handlePageChange(page - 1)}
            >
              Précédent
            </Button>
            <ThemedText style={styles.pageIndicator}>Page {page}/{totalPage}</ThemedText>
            <Button
              mode="outlined"
              style={styles.paginationButton}
              disabled={page === totalPage || isLoading}
              onPress={() => handlePageChange(page + 1)}
            >
              Suivant
            </Button>
          </View>
        </ScrollView>

        <Modal visible={isModalVisible} onDismiss={handleCloseModal} contentContainerStyle={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContainer}>
              <Card style={styles.modalCard}>
                <Card.Title title="Ajouter un post" titleStyle={styles.modalTitle} />
                <Card.Content>
                  <TextInput
                    style={styles.textInput}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    value={addForum.content}
                    placeholder="Contenu"
                    onChangeText={handleContentChange}
                  />
                </Card.Content>
                <Card.Actions style={styles.modalActions}>
                  <View style={{flex:1}}>
                    <Button onPress={handleAddPost}>Ajouter</Button>
                    <Button onPress={handleCloseModal}>Annuler</Button>
                  </View>
                </Card.Actions>
              </Card>
            </View>
          </ScrollView>
        </Modal>

        <Modal visible={isDeleteModalVisible} onDismiss={handleDeleteCloseModal} contentContainerStyle={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContainer}>
              <Card style={styles.modalCard}>
                <Card.Title title="delete Modal " titleStyle={styles.modalTitle} />
                <Card.Content>
                  <ThemedText>Are you sure you want to delete this forum?</ThemedText>
                </Card.Content>
                <Card.Actions style={styles.modalActions}>
                  <View style={{flex:1}}>
                    <Button onPress={handleDelete}>supprimer</Button>
                    <Button onPress={handleDeleteCloseModal}>Annuler</Button>
                  </View>
                </Card.Actions>
              </Card>
            </View>
          </ScrollView>
        </Modal>
      </View>

    </AppView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
