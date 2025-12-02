"use client"

import * as React from "react"
import { Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colorThemes = [
    { name: 'Lilac', value: 'light' },
    { name: 'Green', value: 'light-green' },
    { name: 'Blue', value: 'light-blue' },
    { name: 'Pink', value: 'light-pink' },
    { name: 'Red', value: 'light-red' },
];

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colorThemes.map((colorTheme) => (
          <DropdownMenuItem key={colorTheme.value} onClick={() => setTheme(colorTheme.value)}>
            <div
              className="mr-2 h-4 w-4 rounded-full border"
              style={{ 
                  backgroundColor: `hsl(var(--${colorTheme.value === 'light' ? 'primary' : `${colorTheme.value.replace('light-','')}-primary`}))`
              }}
            />
            <span>{colorTheme.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Mode</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
