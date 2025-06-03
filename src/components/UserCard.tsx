import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { User } from "../services/userService";
import { colors } from "../../theme/theme";
import { MaterialCommunityIcons } from '@expo/vector-icons';


interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
  compact?: boolean;
}

export const UserCard = ({ user, onPress, compact = false }: UserCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => onPress(user)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.subtext}
        />
      </View>

      {!compact && (
        <>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color={colors.subtext}
                style={styles.icon}
              />
              <Text style={styles.infoText}>{user.cep}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="home-outline"
                size={16}
                color={colors.subtext}
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                {user.street}, {user.number}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.cityState}>
              {user.city} - {user.uf}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  compactCard: {
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.subtext,
  },
  cityState: {
    fontSize: 14,
    color: colors.subtext,
  },
  icon: {
    marginRight: 6,
  },
});
