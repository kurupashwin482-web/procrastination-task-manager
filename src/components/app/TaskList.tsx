'use client';

import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { isToday, isYesterday, parseISO, format, compareDesc } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
}

const groupTasksByDate = (tasks: Task[]) => {
  const grouped: { [key: string]: Task[] } = {};

  tasks.forEach((task) => {
    // The date from firestore is 'yyyy-MM-dd' string.
    // parseISO can handle this format correctly.
    const taskDate = parseISO(task.date);
    let dateKey: string;

    if (isToday(taskDate)) {
      dateKey = 'Today';
    } else if (isYesterday(taskDate)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(taskDate, 'MMMM d, yyyy');
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(task);
  });

  return grouped;
};


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

  const groupedTasks = groupTasksByDate(tasks);
  const sortedDateKeys = Object.keys(groupedTasks).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return compareDesc(new Date(a), new Date(b));
  });

  return (
    <div className="space-y-6">
      {sortedDateKeys.map((dateKey) => (
        <div key={dateKey}>
          <h2 className="text-lg font-semibold text-foreground mb-2">{dateKey}</h2>
          <div className="space-y-4">
            {groupedTasks[dateKey].map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}