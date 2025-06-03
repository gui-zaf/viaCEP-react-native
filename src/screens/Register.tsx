import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from "../../theme/theme";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/types";
import {
  formatCEP,
  validateCEP,
  validateName,
  validateStreet,
  validateNumber,
  validateCity,
  validateUF,
} from "../utils/validators";
import { fetchAddressByCEP } from "../services/cepService";

type Props = BottomTabScreenProps<TabParamList, "Register">;

interface FormData {
  name: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  uf: string;
  complement: string;
}

type ValidationState = {
  [K in keyof Omit<FormData, "complement">]: boolean | null;
};

export const Register = ({ navigation }: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    cep: "",
    street: "",
    number: "",
    city: "",
    uf: "",
    complement: "",
  });

  const [focused, setFocused] = useState<keyof FormData | null>(null);
  const [editableFields, setEditableFields] = useState({
    street: false,
    city: false,
    uf: false,
  });
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const isValid: ValidationState = {
    name: formData.name ? validateName(formData.name) : null,
    cep: formData.cep ? validateCEP(formData.cep) : null,
    street: formData.street ? validateStreet(formData.street) : null,
    number: formData.number ? validateNumber(formData.number) : null,
    city: formData.city ? validateCity(formData.city) : null,
    uf: formData.uf ? validateUF(formData.uf) : null,
  };

  const isAllValid = Object.values(isValid).every((value) => value === true);

  // Função para buscar endereço pelo CEP
  const fetchAddress = async (cep: string) => {
    if (!validateCEP(cep)) return;

    setIsLoadingCEP(true);
    setCepError(null);

    try {
      const address = await fetchAddressByCEP(cep);

      setFormData((prev) => ({
        ...prev,
        street: address.logradouro,
        city: address.localidade,
        uf: address.uf,
        complement: address.complemento || prev.complement,
      }));

      // Mantém os campos não editáveis quando preenchidos pela API
      setEditableFields({
        street: false,
        city: false,
        uf: false,
      });
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      setCepError("Não foi possível buscar o endereço. Preencha manualmente.");

      // Permite edição manual quando a API falha
      setEditableFields({
        street: true,
        city: true,
        uf: true,
      });
    } finally {
      setIsLoadingCEP(false);
    }
  };

  // Manipulador para o CEP com debounce
  const handleCEPChange = (text: string) => {
    const formatted = formatCEP(text);

    // Se o CEP está sendo alterado e já existem dados de endereço, limpa os campos
    if (
      formatted !== formData.cep &&
      (formData.street || formData.city || formData.uf)
    ) {
      setFormData((prev) => ({
        ...prev,
        cep: formatted,
        street: "",
        city: "",
        uf: "",
        complement: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, cep: formatted }));
    }

    // Se o usuário apagar o CEP, libera campos para edição
    if (formatted.length === 0) {
      setEditableFields({
        street: true,
        city: true,
        uf: true,
      });
    }
  };

  // Busca endereço quando o CEP estiver completo
  useEffect(() => {
    if (formData.cep.length === 9) {
      // Formato: 00000-000
      fetchAddress(formData.cep);
    }
  }, [formData.cep]);

  const handleSubmit = async () => {
    if (!isAllValid) return;

    try {
      // Importar o serviço de usuários
      const { saveUser } = await import("../services/userService");

      // Preparar os dados do usuário
      const userData = {
        name: formData.name,
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        city: formData.city,
        uf: formData.uf,
        complement: formData.complement || undefined,
      };

      // Salvar o usuário
      await saveUser(userData);

      // Resetar o formulário
      setFormData({
        name: "",
        cep: "",
        street: "",
        number: "",
        city: "",
        uf: "",
        complement: "",
      });

      // Resetar os campos editáveis
      setEditableFields({
        street: false,
        city: false,
        uf: false,
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            // Navegar para a tela de listagem
            navigation.navigate("List");
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o usuário. Tente novamente."
      );
    }
  };

  const getInputProps = (
    field: keyof FormData,
    label: string,
    icon: string,
    options: any = {}
  ) => {
    const isFieldFocused = focused === field;
    const isFieldValid =
      field === "complement"
        ? Boolean(formData[field]) // Para complemento, válido se tiver algum conteúdo
        : isValid[field as keyof ValidationState];
    const hasError = field !== "complement" && isFieldValid === false;
    const isFieldEditable =
      field === "street"
        ? editableFields.street
        : field === "city"
        ? editableFields.city
        : field === "uf"
        ? editableFields.uf
        : true;

    return {
      mode: "flat" as const,
      style: [styles.input, options.style],
      value: formData[field],
      placeholder: options.placeholder || `Digite ${label.toLowerCase()}`,
      onChangeText: (text: string) =>
        setFormData((prev) => ({
          ...prev,
          [field]: options.format ? options.format(text) : text,
        })),
      onFocus: () => {
        setFocused(field);
        scrollViewRef.current?.scrollTo({
          y: options.scrollPosition || 0,
          animated: true,
        });
      },
      onBlur: () => setFocused(null),
      left: (
        <TextInput.Icon
          icon={icon}
          color={isFieldFocused ? colors.primary : colors.subtext}
          size={22}
          forceTextInputFocus={false}
        />
      ),
      right: isFieldValid === true && (
        <TextInput.Icon
          icon="check-circle-outline"
          color={colors.primary}
          size={22}
          forceTextInputFocus={false}
        />
      ),
      outlineStyle: { borderRadius: 12 },
      underlineStyle: { display: "none" },
      error: hasError,
      activeOutlineColor: hasError ? colors.error : colors.primary,
      contentStyle: styles.inputContent,
      theme: {
        colors: {
          background: colors.surface,
          onSurfaceVariant: colors.text,
          error: colors.error,
        },
      },
      multiline: false,
      numberOfLines: 1,
      ellipsizeMode: "tail",
      editable: isFieldEditable,
      ...options,
    };
  };

  const renderLabel = (label: string, isRequired: boolean = true) => (
    <Text style={styles.label}>
      {label}
      {isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
    </Text>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Cadastro</Text>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContainer}>
                <View style={styles.inputRow}>
                  <View style={styles.inputField}>
                    {renderLabel("Nome completo")}
                    <TextInput
                      {...getInputProps(
                        "name",
                        "Nome completo",
                        "account-outline",
                        {
                          placeholder: "Digite seu nome completo",
                          scrollPosition: 0,
                        }
                      )}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputField}>
                    {renderLabel("CEP")}
                    <TextInput
                      {...getInputProps("cep", "CEP", "map-marker-outline", {
                        placeholder: "00000-000",
                        keyboardType: "numeric",
                        maxLength: 9,
                        onChangeText: handleCEPChange,
                        scrollPosition: 80,
                        right: isLoadingCEP ? (
                          <TextInput.Icon
                            icon={() => (
                              <ActivityIndicator
                                size={22}
                                color={colors.primary}
                              />
                            )}
                            forceTextInputFocus={false}
                          />
                        ) : formData.street && formData.city && formData.uf ? (
                          <TextInput.Icon
                            icon="check-circle-outline"
                            color={colors.primary}
                            size={22}
                            forceTextInputFocus={false}
                          />
                        ) : undefined,
                      })}
                    />
                    {cepError && (
                      <Text style={styles.errorText}>{cepError}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.flex7}>
                    {renderLabel("Logradouro")}
                    <TextInput
                      {...getInputProps("street", "Logradouro", "road", {
                        placeholder: "Digite o logradouro",
                        scrollPosition: 160,
                        style:
                          !editableFields.street && formData.street
                            ? [styles.input, styles.disabledInput]
                            : styles.input,
                      })}
                    />
                  </View>
                  <View style={styles.flex4}>
                    {renderLabel("Número")}
                    <TextInput
                      {...getInputProps("number", "Número", "numeric", {
                        placeholder: "Nº",
                        keyboardType: "numeric",
                        scrollPosition: 160,
                      })}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.flex7}>
                    {renderLabel("Cidade")}
                    <TextInput
                      {...getInputProps("city", "Cidade", "domain", {
                        placeholder: "Digite a cidade",
                        scrollPosition: 240,
                        style:
                          !editableFields.city && formData.city
                            ? [styles.input, styles.disabledInput]
                            : styles.input,
                      })}
                    />
                  </View>
                  <View style={styles.flex4}>
                    {renderLabel("UF")}
                    <TextInput
                      {...getInputProps("uf", "UF", "map-outline", {
                        placeholder: "UF",
                        maxLength: 2,
                        autoCapitalize: "characters",
                        scrollPosition: 240,
                        style:
                          !editableFields.uf && formData.uf
                            ? [styles.input, styles.disabledInput]
                            : styles.input,
                      })}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputField}>
                    {renderLabel("Complemento", false)}
                    <TextInput
                      {...getInputProps(
                        "complement",
                        "Complemento",
                        "home-outline",
                        {
                          placeholder: "Digite o complemento (opcional)",
                          scrollPosition: 320,
                        }
                      )}
                    />
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      !isAllValid && styles.buttonDisabled,
                    ]}
                    disabled={!isAllValid}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>Cadastrar</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={24}
                      color={colors.background}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: colors.background,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formContainer: {
    padding: 16,
    gap: 24,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputField: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    height: 56,
  },
  disabledInput: {
    backgroundColor: "#F0F0F2",
    opacity: 0.8,
  },
  inputContent: {
    paddingVertical: 8,
    height: 40,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  flex7: {
    flex: 7,
  },
  flex4: {
    flex: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  requiredAsterisk: {
    color: colors.error,
    marginLeft: 4,
  },
});
