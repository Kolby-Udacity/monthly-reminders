import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BiTrash, BiListPlus } from 'react-icons/bi';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { Button } from '@/components/button';
import { useMutateReminder } from '@/hooks/use-mutate-reminder';
import { useDeleteList } from '@/hooks/use-delete-list';
import { Reminder, ReminderList } from '@/types';

export const ManageList: FC<{ list?: ReminderList }> = ({ list }) => {
  const router = useRouter();
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const deleteList = useDeleteList();

  useEffect(() => {
    if (deleteList.isSuccess) {
      router.push('/');
    }
  }, [deleteList.isSuccess, router]);

  const handleCreateReminderClick = useCallback(() => {
    setReminderModalVisible(true);
  }, []);

  const handleCloseModalRequest = useCallback(() => {
    setReminderModalVisible(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    deleteList.mutate(list!.id!);
  }, [deleteList, list]);

  return (
    <>
      {reminderModalVisible && list?.id && (
        <CreateReminderModal
          listId={list.id}
          onRequestClose={handleCloseModalRequest}
        />
      )}
      <header className="flex justify-between w-full">
        {list ? (
          <h3>{list?.title}</h3>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="h-6 bg-blue rounded w-40" />
          </div>
        )}
        <div className="space-x-2">
          <Button onClick={handleDeleteClick}>
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              <BiTrash />
            </div>
          </Button>
          <Button onClick={handleCreateReminderClick}>
            <div className="w-10 h-10 flex items-center justify-center text-2xl">
              <BiListPlus />
            </div>
          </Button>
        </div>
      </header>
    </>
  );
};

// Create a schema to validate the form with
const formSchema = z.object({
  title: z.string().nonempty({ message: 'Required' }),
  due: z.number().gt(1).lt(27),
  notes: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const CreateReminderModal: FC<{ listId: string; onRequestClose: () => void }> =
  ({ listId, onRequestClose }) => {
    const reminderMutation = useMutateReminder();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(formSchema), // magic that integrates react-hook-form with zod
    });

    useEffect(() => {
      if (reminderMutation.isSuccess) {
        onRequestClose();
      }
    }, [reminderMutation.isSuccess, onRequestClose]);

    const handleBackdropClick = useCallback(() => {
      onRequestClose();
    }, [onRequestClose]);

    const handleCreateSubmit = useCallback(
      (formData: FormData) => {
        const newReminder = {
          ...formData,
          completed: false,
        } as Reminder;

        reminderMutation.mutate({ newReminder, reminderListId: listId });
      },
      [listId, reminderMutation]
    );

    return (
      <>
        <button
          className="backdrop-filter backdrop-blur-sm fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-10"
          onClick={handleBackdropClick}
        />
        <form
          className="fixed bg-light rounded-lg shadow-2xl z-20 w-150 p-10 mt-20 space-y-4 left-1/2 transform -translate-x-1/2"
          onSubmit={handleSubmit(handleCreateSubmit)}
        >
          <h2>Create a reminder</h2>
          <input
            {...register('title')}
            className="p-2 rounded-lg bg-white border border-gray w-full"
            placeholder="title"
            type="text"
            autoFocus
          />
          {errors.title?.message && (
            <p className="text-red">{errors.title.message}</p>
          )}
          <input
            {...register('due', { valueAsNumber: true })}
            className="p-2 rounded-lg bg-white border border-gray w-full"
            placeholder="due"
            type="number"
          />
          {errors.due?.message && (
            <p className="text-red">{errors.due.message}</p>
          )}
          <input
            {...register('notes')}
            className="p-2 rounded-lg bg-white border border-gray w-full"
            placeholder="notes"
            type="text"
          />
          {errors.notes?.message && (
            <p className="text-red">{errors.notes.message}</p>
          )}
          <button
            className="bg-red p-2 rounded-lg border-gray hover:bg-opacity-50 disabled:opacity-20"
            disabled={reminderMutation.isLoading}
          >
            Create reminder
          </button>
        </form>
      </>
    );
  };
