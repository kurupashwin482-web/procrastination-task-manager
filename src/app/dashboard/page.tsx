'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Header from '@/components/app/Header';
import TaskList from '@/components/app/TaskList';
import AddTaskDialog from '@/components/app/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAddTaskDialogOpen, setAddTaskDialogOpen] = useState(false);

  const tasksQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: tasks, isLoading: areTasksLoading } = useCollection(tasksQuery);

  if (isUserLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">My Tasks</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={() => setAddTaskDialogOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Task
              </span>
            </Button>
          </div>
        </div>
        {areTasksLoading ? <TasksSkeleton /> : <TaskList tasks={tasks || []} />}
      </main>
      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onOpenChange={setAddTaskDialogOpen}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Skeleton className="h-8 w-32" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <Skeleton className="h-8 w-48" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <TasksSkeleton />
      </main>
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
