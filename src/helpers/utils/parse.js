import tsvParseSync from 'csv-parse/lib/sync';
import transformData from 'stream-transform';

import { camelCase, transform, unescape } from 'lodash';

import { IGNORE_FIELDS } from './constants'
import { parseBooleans } from 'xml2js/lib/processors';

const genericParser = (objValue, objKey) => {
  let value = unescape(objValue);

  const lowerCaseKey = objKey.toLowerCase();
  const ignore = IGNORE_FIELDS.indexOf(lowerCaseKey) > -1;
  if (!ignore) {
    const isInt = str => (/^(\-|\+)?([1-9]+[0-9]*)$/).test(str);
    const isFloat = v => ((v - parseFloat(v)) + 1) >= 0;

    if (isInt(value)) {
      value = parseInt(value, 10);
    } else if (isFloat(value)) {
      value = parseFloat(value);
    } else {
      value = parseBooleans(objValue, objKey);
    }
  }
  return value;
};

export const parseTSV = (tsv) => {
  const json = tsvParseSync(tsv, {
    relax: true,
    delimiter: '\t',
    quote: '',
    skip_empty_lines: true,
    columns: header => header.map(column => camelCase(column))
  });

  const handler = data => transform(data, (result, value, key) => {
    result[key] = genericParser(value, key);
  });

  return new Promise((resolve, reject) => {
    const data = [];
    transformData(json, handler)
      .on('data', (row) => {
        data.push(row);
      })
      .on('error', (e) => {
        reject(e);
      })
      .on('end', () => {
        resolve(data);
      });
  });
};
