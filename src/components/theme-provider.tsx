"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const themes = [
    'light', 'dark',
    'light-default', 'dark-default',
    'light-green', 'dark-green',
    'light-blue', 'dark-blue',
    'light-pink', 'dark-pink',
    'light-red', 'dark-red'
];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} themes={themes}>{children}</NextThemesProvider>
}
