import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { IconButton } from '@/components/icon-action';
import { useMutateLists } from '@/hooks/use-mutate-lists';
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

const CreateListModal: FC<{ onRequestClose: () => void }> = ({
  onRequestClose,
}) => {
  const reminderListMutation = useMutateLists();

  useEffect(() => {
    if (reminderListMutation.isSuccess) {
      onRequestClose();
    }
  }, [reminderListMutation.isSuccess, onRequestClose]);

  const handleBackdropClick = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleCreateSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as HTMLFormElement);
      const newReminderList = Object.fromEntries(
        data
      ) as unknown as ReminderList;

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
        onSubmit={handleCreateSubmit}
      >
        <h2>Create a list</h2>
        <input
          className="p-2 rounded-lg bg-white border border-gray w-full"
          name="title"
          placeholder="title"
          type="text"
          autoFocus
        />
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
