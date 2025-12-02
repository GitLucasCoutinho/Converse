"use client"

import * as React from "react"
import { Check, Circle, Moon, Palette } from "lucide-react"
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
    { name: 'Lilac', value: 'light', bg: 'hsl(265 53% 94%)' },
    { name: 'Green', value: 'light-green', bg: 'hsl(145 35% 94%)' },
    { name: 'Blue', value: 'light-blue', bg: 'hsl(210 55% 94%)' },
    { name: 'Pink', value: 'light-pink', bg: 'hsl(340 60% 94%)' },
    { name: 'Red', value: 'light-red', bg: 'hsl(0 60% 94%)' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

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
              className="mr-2 h-4 w-4 rounded-full border flex items-center justify-center"
              style={{ backgroundColor: colorTheme.bg }}
            >
                {theme === colorTheme.value && <Circle className="h-2 w-2 fill-current text-primary" />}
            </div>
            <span>{colorTheme.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('dark')}>
            <div className="mr-2 h-4 w-4 flex items-center justify-center">
                <Moon className="h-4 w-4" />
            </div>
          <span>Dark Mode</span>
          {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
