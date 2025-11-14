import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>
}

const DropdownMenuTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  return React.cloneElement(children, { ref, ...props })
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ align = "start", children, className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" && "right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
