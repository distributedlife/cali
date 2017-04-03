const chai = require('chai');

const merger = require('./helpers').merger;
const replaceEmptyStrings = require('./helpers').replaceEmptyStrings;
const filterPhotos = require('./helpers').filterPhotos;

const expect = chai.expect;


describe('helpers', () => {
  describe('merger', () => {
    it('should apply changes', () => {
      expect(merger({ key: 'old', yo: 'bro' }, { key: 'new' })).eql({ key: 'new', yo: 'bro' });
    });

    it('should arrive on site', () => {
      const oldVersion = { address: 'this place' };
      const changes = { dateAttended: 'today' };
      const updatedVersion = { address: 'this place', dateAttended: 'today' };
      expect(merger(oldVersion, changes)).to.eql(updatedVersion);
    });

    it('should handle merging of meterTasks', () => {
      const oldVersion = {
        dateAttended: 'some time',
        meterTasks: [{
          id: 0,
          taskNumber: 1,
          action: 'Replace',
          connectionType: 'some connectionType',
          meterType: 'some type',
          wiringTypeCode: 'some code',
        },
        {
          id: 1,
          taskNumber: 2,
          action: 'Replace',
        }],
      };
      const changes = {
        meterTasks: [{
          id: 0,
          commissionDateTime: 'some time',
          installDateTime: 'some time',
          connectionType: 'some other connectionType',
        }],
      };
      const updatedVersion = {
        dateAttended: 'some time',
        meterTasks: [{
          id: 0,
          taskNumber: 1,
          action: 'Replace',
          connectionType: 'some other connectionType',
          meterType: 'some type',
          wiringTypeCode: 'some code',
          commissionDateTime: 'some time',
          installDateTime: 'some time',
        },
        {
          id: 1,
          taskNumber: 2,
          action: 'Replace',
        }],
      };
      expect(merger(oldVersion, changes)).to.eql(updatedVersion);
    });

    it('should handle merging arrays of arrays', () => {
      const oldVersion = {
        stuff: 'things',
        topList: [{
          id: 1,
          otherStuff: 'more things',
          middleList: [
            { id: 0, stuffy: 'thingsy' },
            {
              id: 1,
              stuffi: 'thingsi',
              bottomList: [
                { id: 3, because: 'I can' },
              ],
            },
          ],
        }],
      };
      const changes = {
        more: 'stuff',
        topList: [{
          id: 1,
          middleList: [
            { id: 0, extra: 'stuff' },
            {
              id: 1,
              stuffi: 'STUFF',
              bottomList: [
                { id: 2, hello: 'can you hear me' },
                { id: 3, bruce: 'wayne' },
              ],
            },
          ],
        }],
      };
      const updatedVersion = {
        stuff: 'things',
        more: 'stuff',
        topList: [{
          id: 1,
          otherStuff: 'more things',
          middleList: [
            { id: 0, stuffy: 'thingsy', extra: 'stuff' },
            {
              id: 1,
              stuffi: 'STUFF',
              bottomList: [
                { id: 3, bruce: 'wayne', because: 'I can' },
                { id: 2, hello: 'can you hear me' }],
            },
          ],
        }],
      };
      expect(merger(oldVersion, changes)).to.eql(updatedVersion);
    });

    it('should handle scenario where super scheduler reschedules when technician has arrived on site',
     () => {
       const oldVersion = {
         time: 'new time',
         jsa: {
           quandas: {
             'Are you in a fit state for work?': null,
             'Another Question': 'No',
           },
         },
       };
       const changes = {
         dateAttended: 'some time before new time',
         jsa: {
           quandas: {
             'Are you in a fit state for work?': 'Yes',
           },
         },
       };
       const updatedVersion = {
         time: 'new time',
         dateAttended: 'some time before new time',
         jsa: {
           quandas: {
             'Another Question': 'No',
             'Are you in a fit state for work?': 'Yes',
           },
         },
       };
       expect(merger(oldVersion, changes)).to.eql(updatedVersion);
     });
  });

  describe('filterPhotos', () => {
    const photo = { id: 'photoyy' };
    const deletedPhoto = { id: 'photoxx', isDeleted: true };
    const workOrderWithPhotos = {
      beforeStatePhotos: [photo, deletedPhoto],
      afterStatePhotos: [photo, deletedPhoto],
      regulatoryDocsPhotos: [photo, deletedPhoto],
      utc: { photos: [photo, deletedPhoto] },
      jsa: {
        quandas: 'quandas not to delete',
        failures: {
          'Are you in a fit state for work?': { photos: [photo, deletedPhoto], notes: null },
          'Are you trained & competent to complete the task?': { photos: [photo, deletedPhoto], notes: null },
          'Do you have the approriate PPE for this job?': { photos: [photo, deletedPhoto], notes: null },
          'Is that PPE in good working order?': { photos: [photo, deletedPhoto], notes: null },
          'Do you require traffic/public management?': { photos: [photo, deletedPhoto], notes: null },
          'If yes, were you able to address?': { photos: [photo, deletedPhoto], notes: null },
          'Are there adverse conditions (heat/cold/wind/rain/UV)?': { photos: [photo, deletedPhoto], notes: null },
          'Are you satisfied with isolation points?': { photos: [photo, deletedPhoto], notes: null },
          'Have you checked for alternate sources of supply?': { photos: [photo, deletedPhoto], notes: null },
          'Is the meter panel in adequate condition?': { photos: [photo, deletedPhoto], notes: null },
          'Does meter panel contain ACM?': { photos: [photo, deletedPhoto], notes: null },
          'Does it require a like for like replacement?': { photos: [photo, deletedPhoto], notes: null },
          'Does it require minor or major works?': { photos: [photo, deletedPhoto], notes: null },
          'Is it safe to proceed?': { photos: [photo, deletedPhoto], notes: null },
        },
      },
    };

    const expectedWorkOrder = {
      beforeStatePhotos: [photo],
      afterStatePhotos: [photo],
      regulatoryDocsPhotos: [photo],
      utc: { photos: [photo] },
      jsa: {
        quandas: 'quandas not to delete',
        failures: {
          'Are you in a fit state for work?': { photos: [photo], notes: null },
          'Are you trained & competent to complete the task?': { photos: [photo], notes: null },
          'Do you have the approriate PPE for this job?': { photos: [photo], notes: null },
          'Is that PPE in good working order?': { photos: [photo], notes: null },
          'Do you require traffic/public management?': { photos: [photo], notes: null },
          'If yes, were you able to address?': { photos: [photo], notes: null },
          'Are there adverse conditions (heat/cold/wind/rain/UV)?': { photos: [photo], notes: null },
          'Are you satisfied with isolation points?': { photos: [photo], notes: null },
          'Have you checked for alternate sources of supply?': { photos: [photo], notes: null },
          'Is the meter panel in adequate condition?': { photos: [photo], notes: null },
          'Does meter panel contain ACM?': { photos: [photo], notes: null },
          'Does it require a like for like replacement?': { photos: [photo], notes: null },
          'Does it require minor or major works?': { photos: [photo], notes: null },
          'Is it safe to proceed?': { photos: [photo], notes: null },
        },
      },
    };

    it('should filter out isDeleted=true photos from the workOrder', () => {
      expect(filterPhotos(workOrderWithPhotos)).to.eql(expectedWorkOrder);
    });
  });

  describe('ReplaceEmptyStrings', () => {
    it('should replace empty string with null', () => {
      const record = {
        cow: {
          horse: '12341234',
          notes: '',
        },
      };

      const expectedRecord = {
        cow: {
          horse: '12341234',
          notes: null,
        },
      };

      expect(replaceEmptyStrings(record)).to.eql(expectedRecord);
    });

    it('should replace multiple empty strings with nulls', () => {
      const record = {
        cow: {
          horse: '12341234',
          notes: '',
          notes2: '',
        },
      };

      const expectedRecord = {
        cow: {
          horse: '12341234',
          notes: null,
          notes2: null,
        },
      };

      expect(replaceEmptyStrings(record)).to.eql(expectedRecord);
    });

    it('should replace multiple empty strings with nulls inside of lists', () => {
      const record = {
        cow: {
          horse: ['', 1, '']
        },
      };

      const expectedRecord = {
        cow: {
          horse: [null, 1, null]

        },
      };

      expect(replaceEmptyStrings(record)).to.eql(expectedRecord);
    });

    it('should leave nulls', () => {
      const record = {
        horse: '1445',
        cow: {
          horse: null,
        },
      };

      expect(replaceEmptyStrings(record)).to.eql(record);
    });
  });
});
