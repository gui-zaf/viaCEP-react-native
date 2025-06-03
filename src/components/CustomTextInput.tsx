import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { colors } from "../../theme/theme";

interface CustomTextInputProps extends TextInputProps {
  hasError?: boolean;
}

export const CustomTextInput = (props: CustomTextInputProps) => {
  const { style, contentStyle, hasError, ...rest } = props;

  return (
    <TextInput
      mode="flat"
      style={[styles.input, style]}
      contentStyle={[styles.content, contentStyle]}
      outlineStyle={styles.outline}
      underlineStyle={{ display: "none" }}
      activeOutlineColor={hasError ? colors.error : colors.primary}
      multiline={false}
      numberOfLines={1}
      theme={{
        colors: {
          background: colors.surface,
          onSurfaceVariant: colors.text,
          error: colors.error,
        },
      }}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    height: 56,
  },
  content: {
    paddingVertical: 8,
    height: 40,
  },
  outline: {
    borderRadius: 12,
  },
});
