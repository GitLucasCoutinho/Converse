"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"

const colorThemes = [
    { name: 'Lilac', value: 'default' },
    { name: 'Green', value: 'green' },
    { name: 'Blue', value: 'blue' },
    { name: 'Pink', value: 'pink' },
    { name: 'Red', value: 'red' },
];

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  const handleColorChange = (color: string) => {
    const currentMode = theme?.startsWith('dark') ? 'dark' : 'light';
    if (color === 'default') {
      setTheme(currentMode);
    } else {
      setTheme(`${currentMode}-${color}`);
    }
  };
  
  const handleModeChange = (mode: 'light' | 'dark') => {
    const currentColor = theme?.split('-')[1];
    if (currentColor && currentColor !== 'light' && currentColor !== 'dark') {
      setTheme(`${mode}-${currentColor}`);
    } else {
      setTheme(mode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Color Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                {colorThemes.map((t) => (
                    <DropdownMenuItem key={t.value} onClick={() => handleColorChange(t.value)}>
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleModeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleModeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
