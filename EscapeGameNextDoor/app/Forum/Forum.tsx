import React, { FC, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useToasted } from "@/context/ContextHook/ToastedContext"; // Adapté React Native toast context
import { UnitofAction } from "@/action/UnitofAction";
import { GetForumDto } from "@/interfaces/PublicationInterface/Forum/getForumDto";

const Forum = () => {
  const [forum, setForum] = useState<GetForumDto[] | null>(null);
  const action = new UnitofAction();
  const [page, setPage] = useState<number>(1);
  const notif = useToasted();

  const fetchForum = async () => {
    try {
      const response = await action.forumAction.getAllForums(page, 5);

      if (response.Success) {
        setForum(response.Data as GetForumDto[]);
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
    fetchForum();
  }, [page]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forum</Text>

      {/* Ici tu peux ajouter tes filtres / contrôles */}

      <ScrollView style={styles.listContainer}>
        {forum ? <ForumList data={forum} /> : <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>
    </View>
  );
};

export default Forum;

interface ForumListProps {
  data: GetForumDto[];
}

const ForumList: FC<ForumListProps> = ({ data }) => {
  return (
    <View>
      {data.map((item) => (
        <ForumItem key={item.id} data={item} />
      ))}
    </View>
  );
};

interface ForumItemProps {
  data: GetForumDto;
}

const ForumItem: FC<ForumItemProps> = ({ data: forum }) => {
  return (
    <View style={styles.forumItem} className="hover: shadom-sm transition-all">
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>A</Text>
        </View>
      </View>
      <View style={styles.forumContent}>
        <Text style={styles.forumTitle}>{forum.title}</Text>
        <Text style={styles.forumDescription}>{forum.content}</Text>
      </View>
      <Image source={{ uri: "https://example.com/media1.png" }} style={styles.forumImage} />
    </View>
  );
};

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
