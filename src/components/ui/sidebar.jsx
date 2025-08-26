import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarProvider = ({ children, className, ...props }) => (
  <div className={cn("flex min-h-screen", className)} {...props}>
    {children}
  </div>
)

const Sidebar = ({ children, className, ...props }) => (
  <div className={cn("w-64 bg-white border-r border-gray-200", className)} {...props}>
    {children}
  </div>
)

const SidebarHeader = ({ children, className, ...props }) => (
  <div className={cn("p-4 border-b border-gray-200", className)} {...props}>
    {children}
  </div>
)

const SidebarContent = ({ children, className, ...props }) => (
  <div className={cn("flex-1 overflow-y-auto", className)} {...props}>
    {children}
  </div>
)

const SidebarFooter = ({ children, className, ...props }) => (
  <div className={cn("p-4 border-t border-gray-200 mt-auto", className)} {...props}>
    {children}
  </div>
)

const SidebarGroup = ({ children, className, ...props }) => (
  <div className={cn("py-2", className)} {...props}>
    {children}
  </div>
)

const SidebarGroupLabel = ({ children, className, ...props }) => (
  <div className={cn("px-4 py-2 text-sm font-medium text-gray-500", className)} {...props}>
    {children}
  </div>
)

const SidebarGroupContent = ({ children, className, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
)

const SidebarMenu = ({ children, className, ...props }) => (
  <ul className={cn("space-y-1", className)} {...props}>
    {children}
  </ul>
)

const SidebarMenuItem = ({ children, className, ...props }) => (
  <li className={cn("", className)} {...props}>
    {children}
  </li>
)

const SidebarMenuButton = React.forwardRef(({ children, className, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  const buttonProps = asChild ? {} : { ref, ...props }
  
  return (
    <Comp {...buttonProps} className={cn("flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md", className)}>
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = ({ children, className, ...props }) => (
  <button className={cn("p-2 hover:bg-gray-100 rounded", className)} {...props}>
    {children}
  </button>
)

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}
