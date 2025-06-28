import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, Alert, StyleSheet } from 'react-native';
import { Card, Text as PaperText, Button, Menu, Divider, Avatar } from 'react-native-paper';
import { UnitofAction } from '@/action/UnitofAction';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { GetPostForumDto } from '@/interfaces/PublicationInterface/Post/getPostForumDto';
import { useRouter } from 'expo-router';
import { AlignJustify } from 'react-native-feather';
import { GetUserDto } from '@/interfaces/User/GetUserDto';
import { useAuth } from '@/context/ContextHook/AuthContext';
import { jwtDecode } from 'jwt-decode';

const PAGE_SIZE = 5;

interface PostItemProps {
    post: GetPostForumDto;
    isForum: boolean;
    refreshPosts: () => void;
}

const PostItem = ({ post, isForum, refreshPosts }: PostItemProps) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState<boolean>(false);
    const [loadingLike, setLoadingLike] = useState<boolean>(false);
    const [visibleUserMenu, setVisibleUserMenu] = useState(false);
    const [visiblePostMenu, setVisiblePostMenu] = useState(false);
    const [getUser, setUser] = useState<GetUserDto | null>(null);
    const router = useRouter();
    const action = new UnitofAction();


  const userD= user.id;
console.log(userD);
const userId = Number(userD);
console.log(userId);
  const isOwner = userId ===post.userId;

    const checkUserLike = useCallback(async () => {
        try {
            const response = isForum
                ? await action.forumAction.Verifylike(post.id)
                : await action.postAction.Verifylike(post.id);
            setLiked(response.Success);
        } catch {
            setLiked(false);
        }
    }, [post.id, isForum]);

    useEffect(() => {
        console.log(isOwner)
        console.log(user);
        console.log("post", post.userId);
        checkUserLike();
    }, [checkUserLike]);

    const handleLike = async (typeLikeId: number) => {
        setLoadingLike(true);
        try {
            const dto = isForum
                ? { forumId: post.id, postForumId: 0, typeLikeId }
                : { forumId: 0, postForumId: post.id, typeLikeId };

            const response = isForum
                ? await action.forumAction.AddlikeToForum(dto)
                : await action.postAction.AddlikeToForum(dto);

            if (response.Success) {
                refreshPosts();
                Alert.alert("Succès", typeLikeId === 1 ? "Like ajouté" : "Like retiré");
            } else {
                Alert.alert("Erreur", response.Message || "Erreur lors de l'action");
            }
        } catch {
            Alert.alert("Erreur", "Erreur lors de l'action de like");
        } finally {
            setLoadingLike(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await action.postAction.deletePost(post.id);
            if (response.Success) {
                refreshPosts();
                Alert.alert("Succès", "Post supprimé");
            } else {
                Alert.alert("Erreur", response.Message || "Suppression impossible");
            }
        } catch {
            Alert.alert("Erreur", "Erreur lors de la suppression");
        }
    };

    const redirectToForumPost = () => {
        router.push({
            pathname: '/Forum/PostForum',
            params: { id: post.id ,forumid:post.forumId},
        });
    };

    return (
        <Card style={{ margin: 8, padding: 12 }}>
            <Card.Title
                title=""
                left={() => (
                    <Menu
                        visible={visibleUserMenu}
                        onDismiss={() => setVisibleUserMenu(false)}
                        anchor={
                            <Button onPress={() => setVisibleUserMenu(true)}>
                                <Avatar.Icon icon="account" size={40} style={styles.defaultAvatar} />
                            </Button>
                        }>
                        <Menu.Item
                            onPress={() => {
                                setVisibleUserMenu(false);
                                router.push({
                                    pathname: "/Signalement/SignalementUser",
                                    params: { id: post.id.toString() }
                                });
                            }}
                            title="Signaler"
                        />
                        <Divider />
                        {isOwner && (
                            <Menu.Item onPress={handleDelete} title="Supprimer" />
                        )}
                    </Menu>
                )}
                right={() => (
                    <Menu
                        visible={visiblePostMenu}
                        onDismiss={() => setVisiblePostMenu(false)}
                        anchor={<Button onPress={() => setVisiblePostMenu(true)}><AlignJustify /></Button>}>
                        <Menu.Item
                            onPress={() => {
                                setVisiblePostMenu(false);
                                router.push({
                                    pathname: "/Signalement/SignalementForum",
                                    params: { id: post.id.toString() },
                                });
                            }}
                            title="Signaler"
                        />
                        <Divider />
                    </Menu>
                )}
            />
            <PaperText variant="titleMedium">Post #{post.id}</PaperText>
            <PaperText variant="bodyMedium" style={{ marginBottom: 8 }}>
                {post.content}
            </PaperText>
            <Card.Actions style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    loading={loadingLike}
                    onPress={() => handleLike(liked ? 2 : 1)}
                    mode={liked ? "outlined" : "contained"}
                >
                    {liked ? "Retirer Like" : "Like"}
                </Button>
                {isForum && (
                    <Button onPress={redirectToForumPost} mode="outlined" icon="eye">
                        Répondre
                    </Button>
                )}
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    defaultAvatar: {
        backgroundColor: '#ccc',
    }
});

interface PostsListProps {
    forumId?: number;
    postForumId?: number;
    page: number;
}

export const PostsList = ({ forumId, postForumId, page }: PostsListProps) => {
    const [posts, setPosts] = useState<GetPostForumDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const action = new UnitofAction();

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            let fetchedPosts: PaginationResponse<GetPostForumDto> | null = null;

            if (forumId) {
                fetchedPosts = await action.postAction.getPostsByForumId(forumId, page, PAGE_SIZE) as PaginationResponse<GetPostForumDto>;
            } else if (postForumId) {
                fetchedPosts = await action.postAction.getPostsFromPostParentId(postForumId, page, PAGE_SIZE)as PaginationResponse<GetPostForumDto>;
            } else {
                setError('Aucun identifiant de forum ou postForum fourni.');
                return;
            }

            setPosts(fetchedPosts?.Data || []);
        } catch {
            setError('Erreur lors du chargement des posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [forumId, postForumId, page]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Chargement des posts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ padding: 20 }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    if (posts.length === 0) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Aucun post trouvé.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PostItem
                    post={item}
                    isForum={!!forumId}
                    refreshPosts={fetchPosts}
                />
            )}
        />
    );
};

export default PostsList;
