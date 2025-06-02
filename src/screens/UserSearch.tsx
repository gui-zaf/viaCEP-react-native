import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User, searchUsersByName } from '../services/userService';
import { colors } from '../../theme/theme';
import { UserCard } from '../components/UserCard';
import { RootStackParamList } from '../navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export const UserSearch = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchUsersByName(query);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user: User) => {
    Keyboard.dismiss();
    navigation.navigate('UserDetails', { userId: user.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pesquisar</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          label="Buscar por nome"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          outlineStyle={{ borderRadius: 12 }}
          left={<TextInput.Icon icon="magnify" />}
          right={
            loading ? (
              <TextInput.Icon icon={() => <ActivityIndicator size={20} color={colors.primary} />} />
            ) : searchQuery ? (
              <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} />
            ) : null
          }
          placeholder="Digite o nome para pesquisar"
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => performSearch(searchQuery)}
        />
      </View>
      
      {loading ? (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.messageText}>Buscando usuários...</Text>
        </View>
      ) : !hasSearched ? (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons name="magnify" size={64} color={colors.subtext} />
          <Text style={styles.messageText}>Digite um nome para buscar</Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons name="account-search-outline" size={64} color={colors.subtext} />
          <Text style={styles.messageText}>Nenhum usuário encontrado</Text>
          <Text style={styles.messageSubtext}>Tente buscar com outro nome</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserCard user={item} onPress={handleUserPress} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  messageSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.subtext,
    textAlign: 'center',
  },
}); 