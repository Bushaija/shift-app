import * as React from "react";
import { View } from "react-native";
import type { ViewRef } from "@/components/primitives/types";
import { cn } from "@/lib/utils";

interface PaginationDotsProps {
  totalPages: number;
  currentPage: number;
  className?: string;
}

const PaginationDots = React.forwardRef<
  ViewRef,
  PaginationDotsProps
>(({ totalPages, currentPage, className }, ref) => (
  <View
    ref={ref}
    className={cn("flex-row justify-center items-center space-x-2", className)}
  >
    {Array.from({ length: totalPages }, (_, index) => (
      <View
        key={index}
        className={cn(
          "w-2 h-2 rounded-full",
          currentPage === index
            ? "bg-blue-600"
            : "bg-gray-300"
        )}
      />
    ))}
  </View>
));

PaginationDots.displayName = "PaginationDots";

export { PaginationDots };
