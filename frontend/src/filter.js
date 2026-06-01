import filter from 'leo-profanity';

filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('ru'));

const filterProfanity = (text) => filter.clean(text);

export default filterProfanity;
