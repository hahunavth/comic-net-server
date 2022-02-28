//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

//Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../server');
// let should = chai.should();

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../index.js'
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Comic list', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
    describe('/GET recently', () => {
        it('it should GET all the comic', (done) => {
            chai.request(app)
                .get('/api/v1/recently?page=2')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').with.lengthOf(36);
                    res.body.should.have.property('pagination');
                    res.body.pagination.should.be.a('object');
                    res.body.pagination.should.have.property('max');
                    res.body.should.have.property('success').to.equal(true);
                    // res.should.have.property('data')
                    // res.body.length.should.be.eql(9); // fixme :)
                    done();
                });
        });
        // it('it should have pagination', (done) => {
        //   chai.request(app)
        //     .get('/api/v1/recently')
        //     .end((err, res) => {
        //       res.should.have.status(200);
        //       res.body.should.be.a('object');
        //       res.body.should.have.property('data');
        //       done();
        //     })
        // })
    });

    //
    describe('/GET hot', () => {
        it('it should GET all the comic', (done) => {
            chai.request(app)
                .get('/api/v1/hot')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').with.lengthOf(36);
                    res.body.should.have.property('pagination');
                    res.body.should.have.property('success').to.equal(true);
                    done();
                });
        });
    });

    //
    describe('/GET top month', () => {
        it('it should GET all the comic', (done) => {
            chai.request(app)
                .get('/api/v1/top-comic/month')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.not.equal(0);
                    res.body.should.have.property('pagination');
                    res.body.pagination.should.be.a('object');
                    // res.body.pagination.should.have.property('max');
                    res.body.should.have.property('success').to.equal(true);
                    done();
                });
        });
    });
});
