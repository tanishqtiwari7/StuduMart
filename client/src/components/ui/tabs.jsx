import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props}>
     {/* Simple implementation using context or just prop drilling for this simple app */}
     {React.Children.map(children, child => {
       if (React.isValidElement(child)) {
         return React.cloneElement(child, { value, onValueChange });
       }
       return child;
     })}
  </div>
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
      className
    )}
    {...props}
  >
     {React.Children.map(children, child => {
       if (React.isValidElement(child)) {
         return React.cloneElement(child, {
            active: value === child.props.value,
            onClick: () => onValueChange(child.props.value)
         });
       }
       return child;
     })}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, active, onClick, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      active 
        ? "bg-white text-slate-950 shadow-sm" 
        : "hover:bg-slate-200/50 hover:text-slate-700",
      className
    )}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => (
  // We need to know the 'active' value here. In a real Radix UI impl, this comes from context.
  // For this simplified version without radix, we rely on the parent Tabs passing `value` down.
  // But strictly structuring:
  // <Tabs value={activeTab}> <TabsContent value="tab1">...</TabsContent> </Tabs>
  // This child doesn't know 'activeTab' unless we pass it specifically or use context.
  // I will assume for simplicity that the consuming component will handle the conditional rendering OR I implement a tiny context.
  
  // Actually, ShadCN TabsContent *is* conditionally rendered.
  // To keep it separate from logic, I will implement a tiny Context here.
  <TabsContext.Consumer>
      {context => {
          if (context.value !== value) return null;
          return (
             <div
                ref={ref}
                className={cn(
                "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
                className
                )}
                {...props}
            >
                {children}
            </div>
          )
      }}
  </TabsContext.Consumer>
))
TabsContent.displayName = "TabsContent"


// Simple Context for Tabs
const TabsContext = React.createContext({ value: "" });

const TabsRoot = ({ value, onValueChange, children, className }) => {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("w-full", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

const TabsListRoot = ({ className, children }) => {
    return (
        <TabsContext.Consumer>
            {({ value, onValueChange }) => (
                <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
                    {React.Children.map(children, child => 
                        React.cloneElement(child, { activeValue: value, onValueChange })
                    )}
                </div>
            )}
        </TabsContext.Consumer>
    )
}

const TabsTriggerRoot = ({ value, children, className, activeValue, onValueChange }) => {
    return (
        <button
            type="button"
            onClick={() => onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeValue === value
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:bg-slate-200/50 hover:text-slate-700",
                className
            )}
        >
            {children}
        </button>
    )
}

export { TabsRoot as Tabs, TabsListRoot as TabsList, TabsTriggerRoot as TabsTrigger, TabsContent }
