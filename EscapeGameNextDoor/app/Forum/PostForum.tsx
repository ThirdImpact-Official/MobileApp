import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useToasted } from "@/context/ContextHook/ToastedContext"; // Adapté React Native toast context
import { UnitofAction } from "@/action/UnitofAction";
import { GetForumDto } from "@/interfaces/PublicationInterface/Forum/getForumDto";
import AppView from '../../components/ui/AppView';
import { useLocalSearchParams } from "expo-router";
import { Button, Card, Divider, List } from "react-native-paper";
import { Container, styled } from '@mui/material';
import { GetPostForumDto } from '../../../../Webclient/webclient/src/pages/app/FAQ/ForumComponent/SelectedForum';
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { GetTypeLikeDto } from "@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto";


export default function postForum()
{
 const { id } = useLocalSearchParams();
  const PAgeSize = 5;
  const [postParent, setPostParent] = useState<GetPostForumDto | null>(null);

  const [postMessage, setpostMessage] = useState<GetPostForumDto[] | null>(null);
  const [typeLike,setTypeLike] = useState<GetTypeLikeDto[] | null>(null)
  const action = new UnitofAction();
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [Error, seterror] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notif = useToasted();
  
  const fetchPostParent = async () => {
    try {
      const response = await action.postAction.getPostById(Number(id)) as ServiceResponse<GetPostForumDto>;
      const post_reponse = await action.postAction.getPostsFromPostParentId(Number(id), page, 5) as PaginationResponse<GetPostForumDto>
      if (response.Success) {
        setPostParent(response.Data as GetPostForumDto);
        setpostMessage(post_reponse.Data as GetPostForumDto[]);
        setTotalPage(post_reponse.TotalPage);
        notif.showToast(response.Message, "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (error) {
      console.error(error);
      notif.showToast("Erreur réseau", "error");
    }
  };

  useEffect(() => {
 fetchPostParent();
  }, [page]);
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPage || isLoading) return;

    setPage(newPage);
  }, [fetchPostParent])
  if (Error) {
    return (
      <AppView>
        <Card style={styles.container}>
          <Card.Title title={"Erreur "} />
          <Card.Content>
            <Text>{Error}</Text>
          </Card.Content>
          <Card.Actions>
            <Button>
              <Text>Retry</Text>
            </Button>
          </Card.Actions>
        </Card>
      </AppView>
    )
  }

  return (
    <AppView>
      <Card style={styles.container}>
        <Card.Title title={"Response"} />
        <Card.Content>
          <View className="space-y-2">
            {
              postMessage?.map((item, idx) => (
                <View>

                  <Card>
                    <Card.Title title=''
                      right={(props) => <Text>{FormUtils.FormatDate(item.creationDate)}</Text>} />
                    <Card.Content>
                      <List.Item
                        key={item.PostId ?? idx}
                        title={item.content ?? "No Title"}
                        description={item.content ?? ""}
                        left={props => <List.Icon {...props} icon="account" />}
                      />

                    </Card.Content>
                    <Card.Actions>
                    <View className="text-center items-center justify-center">
                      <Button>Like</Button>
                      <Button>Dislike</Button>
                      <Button>
                        reponse
                      </Button>

                    </View>
                    </Card.Actions>
                  </Card>
                  <Divider />
                </View>
              ))
            }
          </View>
        </Card.Content>
        <Card.Actions>
          <View>
            <Button onPress={() => handlePageChange(page - 1)}>
              Precedent
            </Button>
            <Text>page {page}/ {totalPage}</Text>
            <Button
              onPress={() => handlePageChange(page - 1)}
            >suivant</Button>
          </View>
        </Card.Actions>
      </Card>
    </AppView>
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
  },
  forumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#aabbcc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  forumContent: {
    flex: 1,
  },
  forumTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  forumDescription: {
    fontSize: 14,
    color: "#444",
  },
  forumImage: {
    width: 80,
    height: 60,
    marginLeft: 12,
    borderRadius: 6,
    backgroundColor: "#ece6f0", // placeholder background
  },
});
