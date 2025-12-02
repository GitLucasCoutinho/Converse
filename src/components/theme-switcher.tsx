"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
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

const themes = [
    { name: 'Lilac', class: 'theme-default' },
    { name: 'Green', class: 'theme-green' },
    { name: 'Blue', class: 'theme-blue' },
    { name: 'Pink', class: 'theme-pink' },
    { name: 'Red', class: 'theme-red' },
];

export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = React.useState('theme-default');

  React.useEffect(() => {
    const themeColor = localStorage.getItem('theme-color') || 'theme-default';
    setCurrentTheme(themeColor);
    
    // remove other theme classes
    document.body.classList.remove(...themes.map(t => t.class));
    if (themeColor !== 'theme-default') {
        document.body.classList.add(themeColor);
    }
  }, []);

  const handleThemeChange = (themeClass: string) => {
    setCurrentTheme(themeClass);
    localStorage.setItem('theme-color', themeClass);
    document.body.classList.remove(...themes.map(t => t.class));
    if (themeClass !== 'theme-default') {
        document.body.classList.add(themeClass);
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
                {themes.map((t) => (
                    <DropdownMenuItem key={t.class} onClick={() => handleThemeChange(t.class)}>
                         <Check className={`mr-2 h-4 w-4 ${currentTheme === t.class ? 'opacity-100' : 'opacity-0'}`} />
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
