import { Button } from "@/components/ui/button";

export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="text-center py-16 px-4">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold tracking-wide">{title}</h3>
      {message && <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">{message}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 font-heading text-xs tracking-wider">
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-1.5" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}