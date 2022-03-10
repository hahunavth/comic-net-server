import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
let should = chai.should();

chai.use(chaiHttp);

const ItComicDetail = (done: any) => {
  chai
    .request(app)
    .get(
      "/api/v1/truyen-tranh/monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132"
    )
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("path").with.be.a("string");
      res.body.should.have.property("title").with.be.a("string");
      res.body.should.have.property("author").with.be.a("string");
      res.body.should.have.property("posterUrl").with.be.a("string");
      res.body.should.have.property("status").with.be.a("string");
      res.body.should.have.property("rate").with.be.a("string");
      res.body.should.have.property("views").with.be.a("string");
      res.body.should.have.property("follows").with.be.a("string");
      res.body.should.have.property("detail").with.be.a("string");
      res.body.should.have.property("chapters").with.be.a("array");
      res.body.should.have
        .property("kind")
        .with.be.a("array")
        .with.length.greaterThanOrEqual(1);

      res.body.chapters.every((i: any) => {
        expect(i).to.have.property("name").with.be.a("string");
        expect(i).to.have.property("updatedAt").with.be.a("string");
        expect(i).to.have.property("url").with.be.a("string");
        expect(i).to.have.property("updatedDistance").with.be.a("string");
        expect(i).to.have.property("updatedView").with.be.a("string");
        expect(i).to.have.property("data-id").with.be.a("string");
        // console.log(i.path);
        expect(i)
          .to.have.property("path")
          .with.be.a("string")
          .with.match(
            /^\/truyen-tranh\/.[\w\s\.-]+\/.[\w\s\.-]+\/.[\w\s\.-]+.\d$/g
          );
        // /truyen-tranh/vo-luyen-dinh-phong/chap-1735/796832 -> match
        // /truyen-tranh/vo-luyen-dinh-phong/chap-1735/323    -> match
        // /truyen-tranh/vo-luyen-dinh-phong/chap-1735/32     -> not
        // /truyen-tranh/vo-luyen-dinh-phong/chap-1735        -> not
        // /truyen-tranh/vo-luyen-dinh-phong                  -> not
        // /truyen-tranh
      });
      done();
    });
};

describe("Comic Detail", () => {
  beforeEach((done) => {
    // Before each test we empty the database in your case
    done();
  });

  describe("/GET truyen-tranh/{id}", () => {
    it("it should GET comic detail information", (done) => {
      ItComicDetail(done);
    });
  });
});
