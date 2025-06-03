import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User, getUserById, deleteUser } from "../services/userService";
import { colors } from "../../theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "UserDetails">;

export const UserDetails = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        if (!userData) {
          setError("Usuário não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleDelete = async () => {
    if (!user) return;

    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o usuário ${user.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              const success = await deleteUser(userId);
              if (success) {
                Alert.alert("Sucesso", "Usuário excluído com sucesso");
                navigation.goBack();
              } else {
                Alert.alert("Erro", "Não foi possível excluir o usuário");
              }
            } catch (error) {
              console.error("Erro ao excluir usuário:", error);
              Alert.alert("Erro", "Ocorreu um erro ao excluir o usuário");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color={colors.error}
        />
        <Text style={styles.errorText}>
          {error || "Usuário não encontrado"}
        </Text>
      </SafeAreaView>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color={colors.primary}
          />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Detalhes</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.userHeader}>
          <MaterialCommunityIcons
            name="account-circle"
            size={64}
            color={colors.primary}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userDate}>
            Cadastrado em: {formatDate(user.createdAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.infoLabel}>CEP</Text>
                  <Text style={styles.infoValue}>{user.cep}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="road"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.infoLabel}>Logradouro</Text>
                  <Text style={styles.infoValue}>{user.street}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="numeric"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.infoLabel}>Número</Text>
                  <Text style={styles.infoValue}>{user.number}</Text>
                </View>
              </View>
            </View>

            {user.complement && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <View>
                    <Text style={styles.infoLabel}>Complemento</Text>
                    <Text style={styles.infoValue}>{user.complement}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="domain"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.infoLabel}>Cidade</Text>
                  <Text style={styles.infoValue}>{user.city}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="map-outline"
                  size={20}
                  color={colors.primary}
                />
                <View>
                  <Text style={styles.infoLabel}>UF</Text>
                  <Text style={styles.infoValue}>{user.uf}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
                  color="white"
                />
                <Text style={styles.deleteButtonText}>Excluir usuário</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  userHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.primaryBackground,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 12,
  },
  userDate: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.subtext,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    marginTop: 2,
  },
  deleteButtonContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
