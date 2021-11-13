import { FC, ReactNode, useCallback, useMemo } from 'react';
import { Reminder } from '@/types';
import {
  useDeleteReminderMutation,
  useUpdateReminderMutation,
} from '@/services/lists';

export const ManageReminders: FC<{ reminders?: Reminder[] }> = ({
  reminders,
}) => {
  const [deleteReminder, { isLoading: isDeleteLoading }] =
    useDeleteReminderMutation();
  const [updateReminder, { isLoading: isUpdateLoading }] =
    useUpdateReminderMutation();

  const handleRemoveClick = useCallback(
    (reminderId: string) => {
      deleteReminder(reminderId);
    },
    [deleteReminder]
  );

  const handleToggleFinishClick = useCallback(
    (reminderId: string, completed: boolean) => {
      updateReminder({ reminderId, completed: !completed });
    },
    [updateReminder]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="shadow overflow-hidden rounded-lg">
        <table className="w-full divide-y divide-gray divide-opacity-50">
          <thead className="bg-white">
            <tr>
              <TableHeader text="Title" />
              <TableHeader text="Due Date" />
              <TableHeader text="Notes" />
              <TableHeader text="Status" />
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray divide-opacity-50">
            {reminders?.map((reminder: Reminder) => (
              <tr key={reminder.id}>
                <TableCell>
                  <p>{reminder.title}</p>
                </TableCell>
                <TableCell>
                  <p>{reminder.due}</p>
                </TableCell>
                <TableCell>
                  <p>{reminder.notes}</p>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    dueDate={reminder.due}
                    completed={reminder.completed}
                  />
                </TableCell>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-red mr-2 bg-light px-2 py-1.5 rounded-lg border border-opacity-50 border-gray hover:bg-red hover:bg-opacity-10"
                    disabled={isDeleteLoading}
                    onClick={() => handleRemoveClick(reminder.id!)}
                  >
                    Remove
                  </button>
                  <button
                    className="text-blue bg-light px-2 py-1.5 rounded-lg border border-opacity-50 border-gray hover:bg-blue hover:bg-opacity-10"
                    disabled={isUpdateLoading}
                    onClick={() =>
                      handleToggleFinishClick(reminder.id!, reminder.completed)
                    }
                  >
                    {reminder.completed ? 'Unfinish' : 'Finish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader: FC<{ text: string }> = ({ text }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
    >
      {text}
    </th>
  );
};

const TableCell: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="text-sm">{children}</div>
      </div>
    </td>
  );
};

type Status = 'late' | 'due' | 'done';

const colorOptions = {
  done: 'bg-green border border-green border-opacity-50',
  late: 'bg-red border border-red border-opacity-50',
  due: 'bg-blue border border-blue border-opacity-50',
};

const StatusBadge: FC<{ dueDate: number; completed: boolean }> = ({
  dueDate,
  completed,
}) => {
  const status = useMemo<Status>(() => {
    if (completed) {
      return 'done';
    } else if (dueDate < new Date().getDate()) {
      return 'late';
    } else {
      return 'due';
    }
  }, [dueDate, completed]);

  return (
    <div
      className={`uppercase rounded-full px-3 py-0.5 text-xs bg-opacity-20 ${colorOptions[status]}`}
    >
      {status}
    </div>
  );
};
