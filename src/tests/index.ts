// During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

// Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../server');
// let should = chai.should();

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
import { EndPaginationItem } from "./utils.js";
let should = chai.should();

chai.use(chaiHttp);

const EndResComicItem = (done: any) => {
  return (err: any, res: any) => {
    const body = res.body;
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("data").with.length.greaterThanOrEqual(1);
    // .with.lengthOf(36);
    res.body.data.every((i: any) => {
      expect(i).to.have.property("name").with.be.a("string");
      expect(i).to.have.property("status").with.be.a("string");
      expect(i).to.have.property("views").with.be.a("string");
      expect(i).to.have.property("follows").with.be.a("string");
      expect(i).to.have.property("updatedDistance").with.be.a("string");
      expect(i).to.have.property("updatedAt").with.be.a("string");
      expect(i).to.have.property("posterUrl").with.be.a("string");
      expect(i)
        .to.have.property("path")
        .with.be.a("string")
        .which.match(/^\/truyen-tranh\/.[\w\s-]+$/g);
      // NOTE:
      // http://localhost:8000/api/v1/truyen-tranh/vo-luyen-dinh-phong/chap-1735/796832 -> NOT MATCH
      // /api/v1/truyen-tranh/vo-luyen-dinh-phong/chap-1735/796832 -> NOT MATCH
      // /truyen-tranh/vo-luyen-dinh-phong/chap-1735/796832 -> NOT MATCH
      // /truyen-tranh/vo-luyen-dinh-phong                  -> MATCH
      expect(i).to.have.property("id").with.be.a("string");
      expect(i).to.have.property("posterUrl").with.be.a("string");
      expect(i)
        .to.have.property("kind")
        .with.be.a("array")
        .with.length.greaterThanOrEqual(1);
      expect(i)
        .to.have.property("lastedChapters")
        .with.be.a("array")
        .with.lengthOf(3);
      // expect(i).to.have.property('name');
    });
    // res.body.data.every((i: any) => expect(i).to.have.property('name').with.key('a'))

    done();
  };
};

// Our parent block
describe("Comic list", () => {
  beforeEach((done) => {
    // Before each test we empty the database in your case
    done();
  });
  /*
   * Test the /GET route
   */
  describe("/GET recently", () => {
    it("it should GET all the comic", (done) => {
      chai
        .request(app)
        .get("/api/v1/recently?page=3")
        .end(EndResComicItem(done));
    });
    it("it should have pagination with page = 2", (done) => {
      chai
        .request(app)
        .get("/api/v1/recently?page=2")
        .end(EndPaginationItem(done));
    });
  });

  //
  describe("/GET hot", () => {
    it("it should GET all the comic", (done) => {
      chai.request(app).get("/api/v1/hot?page=3").end(EndResComicItem(done));
    });

    it("it should have pagination with page = 2", (done) => {
      chai.request(app).get("/api/v1/hot?page=2").end(EndPaginationItem(done));
    });
  });

  //
  describe("/GET find", () => {
    it("it should GET all the comic", (done) => {
      chai
        .request(app)
        .get("/api/v1/find?genders=1&page=3")
        .end(EndResComicItem(done));
    });
    it("it should have pagination with page = 2", (done) => {
      chai
        .request(app)
        .get("/api/v1/find?genders=1&page=2")
        .end(EndPaginationItem(done));
    });
  });

  //
  describe("/GET find-by-name", () => {
    it("it should GET all the comic", (done) => {
      chai
        .request(app)
        .get("/api/v1/find-by-name?name=one&page=3")
        .end(EndResComicItem(done));
    });
    it("it should have pagination with page = 2", (done) => {
      chai
        .request(app)
        .get("/api/v1/find-by-name?name=one&page=2")
        .end(EndPaginationItem(done));
    });
  });

  //
  describe("/GET top month", () => {
    it("it should GET all the comic", (done) => {
      chai
        .request(app)
        .get("/api/v1/top-comic/month")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.data.should.be.a("array");
          res.body.data.length.should.not.equal(0);
          res.body.should.have.property("pagination");
          res.body.pagination.should.be.a("object");
          // res.body.pagination.should.have.property('max');
          res.body.should.have.property("success").to.equal(true);
          done();
        });
    });
  });
});
