import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import * as z from 'zod';

import { IconButton } from '@/components/icon-action';
import { useCreateList } from '@/services';
import { ReminderList } from '@/types';

export const CreateList: FC = () => {
  const [createListModalVisible, setCreateListModalVisible] = useState(false);

  const handleButtonClick = useCallback(() => {
    setCreateListModalVisible(true);
  }, []);

  const handleCloseModalRequest = useCallback(() => {
    setCreateListModalVisible(false);
  }, []);

  return (
    <>
      {createListModalVisible && (
        <CreateListModal onRequestClose={handleCloseModalRequest} />
      )}
      <IconButton text="+ Create a reminder list" onClick={handleButtonClick} />
    </>
  );
};

// Create a schema to validate the form with
const formSchema = z.object({
  title: z.string().nonempty({ message: 'Required' }),
});

const CreateListModal: FC<{ onRequestClose: () => void }> = ({
  onRequestClose,
}) => {
  const reminderListMutation = useCreateList();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReminderList>({
    resolver: zodResolver(formSchema), // magic that integrates react-hook-form with zod
  });

  useEffect(() => {
    if (reminderListMutation.isSuccess) {
      onRequestClose();
    }
  }, [reminderListMutation.isSuccess, onRequestClose]);

  const handleBackdropClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleCreateSubmit = useCallback(
    (newReminderList: ReminderList) => {
      reminderListMutation.mutate(newReminderList);
    },
    [reminderListMutation]
  );

  return (
    <>
      <button
        className="backdrop-filter backdrop-blur-sm fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-10"
        onClick={handleBackdropClick}
      />
      <form
        className="fixed bg-light rounded-lg shadow-2xl z-20 w-150 p-10 mt-20 space-y-4"
        onSubmit={handleSubmit(handleCreateSubmit)}
      >
        <h2>Create a list</h2>
        <input
          className="p-2 rounded-lg bg-white border border-gray w-full"
          {...register('title')}
          placeholder="title"
          type="text"
          autoFocus
        />
        {errors.title?.message && (
          <p className="text-red">{errors.title.message}</p>
        )}
        <button
          className="bg-red p-2 rounded-lg border-gray hover:bg-opacity-50 disabled:opacity-20"
          disabled={reminderListMutation.isLoading}
        >
          Create list
        </button>
      </form>
    </>
  );
};
