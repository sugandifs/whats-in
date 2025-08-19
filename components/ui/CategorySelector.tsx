import { useThemedStyles } from "@/hooks/useThemedStyles";
import { componentStyles } from "@/styles/componentStyles";
import { getCategoryColor } from "@/utils/styleHelpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { themedColors } = useThemedStyles();

  const renderCategoryCard = ({ item }: { item: Category }) => {
    const isSelected = selectedCategory === item.id;
    const color = item.color || getCategoryColor(item.id);

    return (
      <TouchableOpacity
        style={[
          componentStyles.categoryCard,
          {
            borderColor: themedColors.border,
            backgroundColor: themedColors.backgroundTertiary,
          },
          isSelected && {
            backgroundColor: `${color}20`,
            borderColor: color,
          },
        ]}
        onPress={() => onSelectCategory(item.id)}
      >
        <ThemedView
          style={[
            componentStyles.categoryIcon,
            { backgroundColor: `${color}20` },
          ]}
        >
          <Ionicons name={item.icon as any} size={20} color={color} />
        </ThemedView>
        <ThemedText
          type="defaultSemiBold"
          style={componentStyles.categoryName}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          type="default"
          style={componentStyles.categoryCount}
        >
          {item.count}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={categories}
      renderItem={renderCategoryCard}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingLeft: 16 }}
    />
  );
};
