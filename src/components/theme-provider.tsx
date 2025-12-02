"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const themes = [
    'light', 
    'dark',
    'light-green',
    'light-blue',
    'light-pink',
    'light-red'
];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} themes={themes}>{children}</NextThemesProvider>
}
