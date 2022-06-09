import deepmerge from 'deepmerge';

const defaultReminderList = {};

export const generateReminderList = (
  override: any = {},
  options: deepmerge.Options = {}
): any => {
  return deepmerge(defaultReminderList, override, options);
};
