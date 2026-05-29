import * as yup from 'yup';

export const getChannelSchema = (existingNames, currentName = null) => {
  const namesToCheck = currentName
    ? existingNames.filter((name) => name !== currentName)
    : existingNames;

  return yup.object({
    name: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(namesToCheck, 'Должно быть уникальным'),
  });
};
