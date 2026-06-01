import filter from 'leo-profanity';

filter.loadDictionary('ru');

const filterProfanity = (text) => filter.clean(text);

export default filterProfanity;
