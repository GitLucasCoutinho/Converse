"use client"

import * as React from "react"
import { Moon, Palette, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colorThemes = [
    { name: 'Lilac', value: 'default' },
    { name: 'Green', value: 'green' },
    { name: 'Blue', value: 'blue' },
    { name: 'Pink', value: 'pink' },
    { name: 'Red', value: 'red' },
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
          <DropdownMenuSub key={colorTheme.value}>
            <DropdownMenuSubTrigger>
              <span
                className="mr-2 h-4 w-4 rounded-full"
                style={{ 
                    backgroundColor: `hsl(var(--${colorTheme.value === 'default' ? 'primary' : `${colorTheme.value}-primary`}))`
                }}
              />
              <span>{colorTheme.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme(colorTheme.value === 'default' ? 'light' : `light-${colorTheme.value}`)}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(colorTheme.value === 'default' ? 'dark' : `dark-${colorTheme.value}`)}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
