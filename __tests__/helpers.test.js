// import from helpers.js file
const {format_date, format_plural, format_url} = require('../utils/helpers');

// make the dates a little more readable. 
// write a test to ensure that format_date() takes Date() objects 
// and returns dates in the MM/DD/YYYY format
test('format_date() returns a date string', () => {
    const date = new Date('2020-03-20 16:12:03');

    expect(format_date(date)).toBe('3/20/2020');
});

// we want the words "point" and "comment" to appear in their plural forms 
// only when there are multiple points and comments, respectively
// test to check that format_plural() correctly pluralizes words
test('format_plural() correctly pluralizes words', () => {
    const word1 = format_plural('Tiger', 2);
    const word2 = format_plural('Lion', 1);
    expect(word1).toBe('Tigers');
    expect(word2).toBe('Lion');
})

// url shortening test
test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');
  
    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});