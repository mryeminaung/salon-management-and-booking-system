"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/auth-store"
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  MonitorIcon,
  PaletteIcon,
  UserRoundIcon,
} from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const role = useAuthStore((s) => s.user?.role)
  const settingsBase = role === "owner" ? "/admin/settings" : "/settings"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 outline-none hover:bg-accent/50 transition-colors cursor-pointer">
        <Avatar className="size-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xs">
            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem nativeButton={false} render={<Link href={`${settingsBase}/profile`} />}>
            <UserRoundIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem nativeButton={false} render={<Link href={`${settingsBase}/account`} />}>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem nativeButton={false} render={<Link href={`${settingsBase}/appearance`} />}>
            <PaletteIcon />
            Appearance
          </DropdownMenuItem>
          <DropdownMenuItem nativeButton={false} render={<Link href={`${settingsBase}/notifications`} />}>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem nativeButton={false} render={<Link href={`${settingsBase}/display`} />}>
            <MonitorIcon />
            Display
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
