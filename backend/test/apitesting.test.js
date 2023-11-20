const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');


chai.use(chaiHttp);
const expect = chai.expect;
describe('Restaurant Manager API', () => {
  describe('GET https://localhost:5000/api/restaurant-manager/details/:managerId', () => {
    it('should return details of the restaurant managed by the given managerId', (done) => {
        const mockRestaurant = {
          Res_name: 'Mock Restaurant',
          manager: new mongoose.Types.ObjectId(),
          EmenuCard: [
            {
              name: 'Dish 1',
              pic: 'dish1.jpg',
              price: 10,
            },
           
          ],
          location: 'Mock Location',
        };
     
        // Mock the Restaurant.findOne method
        sinon.stub(Restaurant, 'findOne').resolves(mockRestaurant);
     
        chai.request(app)
          .get(`https://localhost:5000/api/restaurant-manager/details/${mockRestaurant.manager}`)
          .end((err, res) => {
            // Restore the stub after the test
            sinon.restore();
     
            // Convert ObjectId to string for comparison
            mockRestaurant.manager = mockRestaurant.manager.toString();
     
            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(mockRestaurant);
     
            done();
          });
      });
     
    it('should return 404 if the restaurant is not found', (done) => {
      // Mock the Restaurant.findOne method to return null
      sinon.stub(Restaurant, 'findOne').resolves(null);


      chai.request(app)
        .get('https://localhost:5000/api/restaurant-manager/details/nonexistentManagerId')
        .end((err, res) => {
          // Restore the stub after the test
          sinon.restore();


          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message').equal('Restaurant not found');


          done();
        });
    });


    it('should handle internal server errors', (done) => {
      // Mock the Restaurant.findOne method to throw an error
      sinon.stub(Restaurant, 'findOne').throws(new Error('Internal server error'));


      chai.request(app)
        .get('https://localhost:5000/api/restaurant-manager/details/errorManagerId')
        .end((err, res) => {
          // Restore the stub after the test
          sinon.restore();


          expect(res).to.have.status(500);
          expect(res.body).to.have.property('message').equal('Internal server error');


          done();
        });
    });
  });
});
