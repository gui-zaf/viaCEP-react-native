import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  uf: string;
  complement?: string;
  createdAt: number;
}

const USERS_STORAGE_KEY = "@viaCEP:users";

// Normalizar texto para pesquisa (remove acentos, converte para minúsculas)
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Salvar um novo usuário
export const saveUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  try {
    const storedUsers = await getUsers();

    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    const updatedUsers = [...storedUsers, newUser];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return newUser;
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    throw error;
  }
};

// Obter todos os usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
};

// Buscar usuário por ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    return users.find((user) => user.id === id) || null;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    return null;
  }
};

// Buscar usuários por nome
export const searchUsersByName = async (name: string): Promise<User[]> => {
  try {
    if (!name.trim()) return [];

    const users = await getUsers();
    const normalizedSearchName = normalizeText(name);

    return users.filter((user) =>
      normalizeText(user.name).includes(normalizedSearchName)
    );
  } catch (error) {
    console.error("Erro ao buscar usuários por nome:", error);
    return [];
  }
};

// Excluir usuário
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const users = await getUsers();
    const updatedUsers = users.filter((user) => user.id !== id);

    if (users.length === updatedUsers.length) {
      return false; // Usuário não encontrado
    }

    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return false;
  }
};
