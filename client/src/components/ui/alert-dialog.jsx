import * as React from "react";
import { cn } from "../../lib/utils";

const AlertDialog = React.forwardRef(({ ...props }, ref) => <div {...props} />); // Simplified for this implementation, usually wraps context

const AlertDialogTrigger = React.forwardRef(
  ({ className, children, asChild, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    // This is a very simplified mock because implementing full Radix-like Alert Dialog from scratch is complex.
    // Ideally we should use the Dialog component we already have or a library.
    // But since I imported it as a separate component, I need to make it work.
    // Let's actually just re-export Dialog components with different names or wrap them.
    return null;
  }
);

// BETTER APPROACH: Re-implement using the existing Dialog logic but styled as Alert
// Since I don't have a full UI library installed, I will create a custom implementation
// that mimics the ShadCN API using standard React state.

const AlertDialogContext = React.createContext({});

const AlertDialogRoot = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  // Sync internal state with prop changes
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (value) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  return (
    <AlertDialogContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
};

const AlertDialogTriggerRoot = ({ children, asChild, ...props }) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <div onClick={() => onOpenChange(true)} {...props}>
      {children}
    </div>
  );
};

const AlertDialogContentRoot = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(AlertDialogContext);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 animate-in fade-in zoom-in-95 sm:rounded-lg md:w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
AlertDialogContentRoot.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  )
);
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext);
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(false);
        }}
        {...props}
      />
    );
  }
);
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext);
    return (
      <button
        ref={ref}
        className={cn(
          "mt-2 inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(false);
        }}
        {...props}
      />
    );
  }
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialogRoot as AlertDialog,
  AlertDialogTriggerRoot as AlertDialogTrigger,
  AlertDialogContentRoot as AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
