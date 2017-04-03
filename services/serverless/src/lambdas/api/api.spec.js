'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const requireInject = require('require-inject');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');

chai.use(dirtyChai);
chai.use(chaiHttp);

describe('appy api', () => {
  beforeEach(() => {
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    console.error.restore();
  });

  describe('/v2/work-orders', () => {
    context('normal behaviour', () => {
      let getWorkOrders;
      let app;

      beforeEach(() => {
        getWorkOrders = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/get-work-orders': getWorkOrders,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to getWorkOrders', () => {
        const promise = chai.request(app)
          .get('/appy/v2/work-orders')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(getWorkOrders).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('/work-orders/:workOrderNumber', () => {
    context('normal behaviour', () => {
      let getWorkOrder;
      let app;

      beforeEach(() => {
        getWorkOrder = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/get-work-order': getWorkOrder,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to getWorkOrder', () => {
        const promise = chai.request(app)
          .get('/appy/work-orders/WO-1234')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(getWorkOrder).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('/work-orders/{workOrderNumber}/update', () => {
    context('normal behaviour', () => {
      let updateWorkOrder;
      let app;

      beforeEach(() => {
        updateWorkOrder = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/update-work-order': updateWorkOrder,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to updateWorkOrder', () => {
        const promise = chai.request(app)
          .post('/appy/work-orders/WO-1234/update')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(updateWorkOrder).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('/work-orders/{workOrderNumber}/photos', () => {
    context('normal behaviour', () => {
      let uploadPhoto;
      let app;

      beforeEach(() => {
        uploadPhoto = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/upload-photo': uploadPhoto,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to uploadPhoto', () => {
        const promise = chai.request(app)
          .post('/appy/work-orders/WO-1234/photos')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(uploadPhoto).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('/work-orders/{workOrderNumber}/cancel', () => {
    context('normal behaviour', () => {
      let cancelWorkOrder;
      let app;

      beforeEach(() => {
        cancelWorkOrder = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/cancel-work-order': cancelWorkOrder,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to cancelWorkOrder', () => {
        const promise = chai.request(app)
          .post('/appy/work-orders/WO-1234/cancel')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(cancelWorkOrder).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('GET /work-orders/{workOrderNumber}/clashes', () => {
    context('normal behaviour', () => {
      let getWorkOrderClashes;
      let app;

      beforeEach(() => {
        getWorkOrderClashes = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/get-work-order-clashes': getWorkOrderClashes,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to getWorkOrderClashes', () => {
        const promise = chai.request(app)
          .get('/appy/work-orders/WO-1234/clashes')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(getWorkOrderClashes).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('on failure', () => {
    let app;
    const rejectedPromise = () => Promise.reject('Boom');
    beforeEach(() => {
      app = requireInject('./api', {
        './src/get-work-order': rejectedPromise,
        './src/get-work-orders': rejectedPromise,
        './src/update-work-order': rejectedPromise,
        './src/cancel-work-order': rejectedPromise,
        './src/upload-photo': rejectedPromise,
        './src/register-heartbeat': rejectedPromise,
        'express-jwt': sinon.stub().returns((req, res, next) => next()),
      });
    });
    context('get requests', () => {
      ['/appy/v2/work-orders', '/appy/work-orders/WO-1234'].forEach((uri) => {
        it('should return a 400 when the promise is rejected', () => {
          const promise = chai.request(app)
            .get(uri)
            .catch((err) => {
              expect(err).to.have.status(400);
            });

          return promise;
        });

        it('should log a console error', () => {
          const promise = chai.request(app)
            .get(uri)
            .catch(() => {
              expect(console.error.called).to.eql(true);
            });

          return promise;
        });
      });
    });
    context('post requests', () => {
      [
        '/appy/work-orders/WO-1234/update',
        '/appy/work-orders/WO-1234/photos',
        '/appy/work-orders/WO-1234/cancel',
        '/appy/technician/homersimpson/heartbeat',
      ].forEach((uri) => {
        it('should return a 400 when the promise is rejected', () => {
          const promise = chai.request(app)
            .post(uri)
            .catch((err) => {
              expect(err).to.have.status(400);
            });

          return promise;
        });

        it('should return a specifc response code if include in the error', () => {
          app = requireInject('./api', {
            './src/update-work-order': () => Promise.reject({ code: 409 }),
            './src/upload-photo': () => Promise.reject({ code: 409 }),
            './src/cancel-work-order': () => Promise.reject({ code: 409 }),
            './src/register-heartbeat': () => Promise.reject({ code: 409 }),
            'express-jwt': sinon.stub().returns((req, res, next) => next()),
          });
          const promise = chai.request(app)
            .post(uri)
            .catch((err) => {
              expect(err).to.have.status(409);
            });

          return promise;
        });

        it('should log a console error', () => {
          const promise = chai.request(app)
            .post(uri)
            .catch(() => {
              expect(console.error.called).to.eql(true);
            });

          return promise;
        });
      });
    });
  });

  describe('POST /technician/:technicianId/heartbeat', () => {
    context('normal behaviour', () => {
      let registerHeartbeat;
      let app;

      beforeEach(() => {
        registerHeartbeat = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/register-heartbeat': registerHeartbeat,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to heartbeat', () => {
        const promise = chai.request(app)
          .post('/appy/technician/homersimpson/heartbeat')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(registerHeartbeat).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('GET /technician/:technicianId/heartbeat', () => {
    context('normal behaviour', () => {
      let getHeartbeat;
      let app;

      beforeEach(() => {
        getHeartbeat = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/get-heartbeat': getHeartbeat,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to heartbeat', () => {
        const promise = chai.request(app)
          .get('/appy/technician/homersimpson/heartbeat')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(getHeartbeat).to.have.been.called();
          });

        return promise;
      });
    });
  });

  describe('GET /technicians', () => {
    context('normal behaviour', () => {
      let getTechnicians;
      let app;

      beforeEach(() => {
        getTechnicians = sinon.stub().returns(Promise.resolve('Boom'));
        app = requireInject('./api', {
          './src/get-technicians': getTechnicians,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should delegate to heartbeat', () => {
        const promise = chai.request(app)
        .get('/appy/technicians')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(getTechnicians).to.have.been.called();
        });

        return promise;
      });
    });
  });

  describe('GET /send-to-sage/:workOrder', () => {
    context('normal behaviour', () => {
      let app;
      let sendToSage;

      beforeEach('', () => {
        sendToSage = sinon.stub().returns(Promise.resolve('hello'));
        app = requireInject('./api', {
          './src/sendToSage': sendToSage,
          'express-jwt': sinon.stub().returns((req, res, next) => next()),
        });
      });

      it('should pass the request to the handler', () => {
        const promise = chai.request(app)
          .get('/appy/send-to-sage/WO1')
          .then((res) => {
            expect(sendToSage.getCall(0).args[0].url).to.eql('/appy/send-to-sage/WO1');
            expect(res).to.have.status(200);
          });

        return promise;
      });
    });
  });
});
