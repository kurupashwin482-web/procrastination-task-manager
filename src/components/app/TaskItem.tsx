'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Trash2, CalendarIcon, ClockIcon, Star } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { isPast, isToday, format, isValid } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const difficultyPoints: Record<string, number> = {
  easy: 10,
  medium: 15,
  complex: 30,
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  complex: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
};

export default function TaskItem({ task }: TaskItemProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
    const userRef = doc(firestore, 'users', user.uid);
    const points = difficultyPoints[task.difficulty] || 0;

    try {
      await updateDoc(taskRef, { completed: !task.completed });
      if (!task.completed) {
        await updateDoc(userRef, { points: increment(points) });
      } else {
        await updateDoc(userRef, { points: increment(-points) });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDelete = async () => {
    if (!user) return;
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
    try {
      await deleteDoc(taskRef);
      if (task.completed) {
        const userRef = doc(firestore, 'users', user.uid);
        const points = difficultyPoints[task.difficulty] || 0;
        await updateDoc(userRef, { points: increment(-points) });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const taskDate = new Date(task.date);
  const isDateValid = isValid(taskDate);
  const isTaskPast = isDateValid && isPast(taskDate) && !isToday(taskDate);

  return (
    <Card className={cn(
      'transition-all',
      task.completed ? 'bg-secondary/50' : 'bg-secondary',
      isTaskPast && !task.completed && 'border-destructive/50'
    )}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleComplete}
          disabled={isUpdating}
          className="mt-1"
        >
          {task.completed ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </Button>
        <div className="flex-1">
          <CardTitle className={cn('text-lg', task.completed && 'line-through text-muted-foreground')}>
            {task.title}
          </CardTitle>
          {task.description && (
             <CardDescription className={cn('mt-1', task.completed && 'line-through text-muted-foreground/80')}>
                {task.description}
            </CardDescription>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {isDateValid && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(taskDate, 'PPP')}</span>
            </div>
          )}
          {task.time && (
             <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>{task.time}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('capitalize', difficultyColors[task.difficulty])}>
                {task.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span>{difficultyPoints[task.difficulty]}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
