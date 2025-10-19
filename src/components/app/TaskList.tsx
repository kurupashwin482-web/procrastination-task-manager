'use client';

import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
        <Card className="mt-4 border-dashed border-2">
            <CardHeader>
                <CardTitle>No Tasks Yet</CardTitle>
                <CardDescription>Click "Add Task" to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground">
                    Your tasks will appear here once you add them.
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
