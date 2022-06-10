import deepmerge from 'deepmerge';

const defaultReminderList = {
  data: {
    reminderLists: [
      {
        id: 'ckx80plqwibd50c20hgqhfgz2',
        title: 'Bills',
        reminders: [
          {
            id: 'ckx80pxbkijp30b20xh0551yi',
            title: 'Rent',
            due: 2,
            notes: 'www.rent.com',
            completed: false,
          },
          {
            id: 'ckx80vipkiov30b20t4wa3agr',
            title: 'Power',
            due: 12,
            notes: 'www.power.com',
            completed: false,
          },
          {
            id: 'cl47b83avp26y0bk2qx95b8f3',
            title: 'Internet',
            due: 2,
            notes: 'www.internet.com',
            completed: true,
          },
        ],
      },
      {
        id: 'ckx80plqwis20c20hgqhfgz2',
        title: 'List 2',
        reminders: [
          {
            id: 'ckx80pxbkijp30b20xh0551yi',
            title: 'Rent',
            due: 2,
            notes: 'www.rent.com',
            completed: false,
          },
        ],
      },
    ],
  },
};

export const generateReminderList = (override: any = {}, options: deepmerge.Options = {}): any => {
  return deepmerge(defaultReminderList, override, options);
};
