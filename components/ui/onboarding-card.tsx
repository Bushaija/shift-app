import * as React from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import type { ViewRef } from "@/components/primitives/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { Text } from "./text";

interface OnboardingCardProps {
  title: string;
  description: string;
  imageSource?: ImageSourcePropType;
  imageAlt?: string;
  className?: string;
  children?: React.ReactNode;
}

const OnboardingCard = React.forwardRef<
  ViewRef,
  OnboardingCardProps
>(({ title, description, imageSource, imageAlt, className, children }, ref) => (
  <View ref={ref} className={cn("flex-1", className)}>
    {/* Dark Blue Top Section */}
    <View className="bg-blue-900 flex-1 justify-center px-6">
      <Text className="text-white text-2xl font-bold mb-2 text-center">
        {title}
      </Text>
      <Text className="text-white text-base text-center opacity-90">
        {description}
      </Text>
    </View>

    {/* Image Section */}
    <View className="flex-1 justify-center items-center bg-gray-50">
      {imageSource ? (
        <Image
          source={imageSource}
          alt={imageAlt}
          className="w-64 h-64"
          resizeMode="contain"
        />
      ) : (
        <View className="w-64 h-64 bg-gray-200 rounded-lg justify-center items-center">
          <Text className="text-gray-500">Image Placeholder</Text>
        </View>
      )}
    </View>

    {/* White Bottom Section */}
    <View className="bg-white px-6 py-8">
      {children}
    </View>
  </View>
));

OnboardingCard.displayName = "OnboardingCard";

export { OnboardingCard };
