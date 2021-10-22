const validateAge = (date) => {
  let birthdate = new Date(
    date.split('/')[2],
    date.split('/')[1],
    date.split('/')[0]
  );
  let today = new Date();
  let before = new Date().setFullYear(today.getFullYear() - 122);
  let limit = new Date().setFullYear(today.getFullYear() - 18);

  if (birthdate > today) return new Error({ message: 'Invalid Age' });
  if (birthdate < before) return new Error({ message: 'Invalid Age' });

  if (birthdate < limit) {
    return true;
  } else {
    return new Error({ message: 'You must be 18 or older' });
  }
};
