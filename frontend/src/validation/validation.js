import * as yup from 'yup';

export const setLocale = (t) => {
  yup.setLocale({
    mixed: {
      required: () => t('modals.required'),
      notOneOf: () => t('modals.uniq'),
      oneOf: () => t('signup.mustMatch'),
    },
    string: {
      min: ({ min }) => (
        min === 6 ? t('signup.passMin') : t('signup.usernameConstraints')
      ),
      max: () => t('signup.usernameConstraints'),
    },
  });
};

export const getChannelSchema = (existingNames, currentName = null) => {
  const namesToCheck = currentName
    ? existingNames.filter((name) => name !== currentName)
    : existingNames;

  return yup.object({
    name: yup.string().required().min(3).max(20).notOneOf(namesToCheck),
  });
};

export const getSignupSchema = () => yup.object({
  username: yup.string().required().min(3).max(20),
  password: yup.string().required().min(6),
  confirmPassword: yup.string().required().oneOf([yup.ref('password')]),
});
