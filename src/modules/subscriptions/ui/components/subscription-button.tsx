import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SubscriptionButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? 'secondary' : 'default'}
      className={cn('rounded-full', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </Button>
  );
};
