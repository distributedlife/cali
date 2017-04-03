const merge = require('lodash').mergeWith;
const constants = require('./constants');

const notFound = -1;

const mergeArrays = (objValue, srcValue) => {
  const result = objValue;
  if (!Array.isArray(objValue)) {
    return undefined;
  }

  srcValue.forEach((entry) => {
    const index = objValue.findIndex((item) => item.id === entry.id);
    if (index === notFound) {
      result.push(entry);
    } else {
      result[index] = merge({}, objValue[index], entry, mergeArrays);
    }
  });
  return result;
};

const merger = (oldVersion, update) => merge({}, oldVersion, update, mergeArrays);

const JSA_QUESTIONS = constants.JSA_QUESTIONS;

const filterDeletedPhotos = (photos) =>
  photos.filter((photo) => (!photo.isDeleted));

const jsaQuestionPhotoFilter = (workOrder, question) => {
  workOrder.jsa.failures[question].photos =
    filterDeletedPhotos(workOrder.jsa.failures[question].photos);
  return workOrder;
};

const filterDeletedJsaPhotos = (workOrder) =>
  JSA_QUESTIONS.reduce(jsaQuestionPhotoFilter, workOrder);

const filterDeletedUtcPhotos = (workOrder) => {
  workOrder.utc.photos =
    filterDeletedPhotos(workOrder.utc.photos);
  return workOrder;
};

const initialPhotosFilter = (workOrder) =>
  Object.assign({}, workOrder, {
    beforeStatePhotos: filterDeletedPhotos(workOrder.beforeStatePhotos),
    afterStatePhotos: filterDeletedPhotos(workOrder.afterStatePhotos),
    regulatoryDocsPhotos: filterDeletedPhotos(workOrder.regulatoryDocsPhotos),
  });

const filterPhotos = (workOrder) =>
  filterDeletedUtcPhotos(filterDeletedJsaPhotos(initialPhotosFilter(workOrder)));

const replaceEmptyStrings = (json) => {
  const stringified = JSON.stringify(json);

  const globalEmptyString = /""/g;
  const noEmptyStrings = stringified.replace(globalEmptyString, null);
  return JSON.parse(noEmptyStrings);
};

module.exports = { merger, filterPhotos, replaceEmptyStrings };
