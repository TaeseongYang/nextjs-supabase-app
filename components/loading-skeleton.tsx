import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "card" | "list" | "form";
  count?: number;
}

function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b py-3 last:border-0">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  );
}

function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function LoadingSkeleton({ type, count = 3 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="rounded-lg border px-4">
        {items.map((_, i) => (
          <ListRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      {items.map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
    </div>
  );
}
