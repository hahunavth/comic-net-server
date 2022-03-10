import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
import { EndPaginationItem } from "./utils.js";

let should = chai.should();

chai.use(chaiHttp);

function EndComment(done: any) {
  done();
}

describe("Comment", () => {
  describe("/GET comic-comment", () => {
    it("it should have pagination with page = 2", (done) => {
      chai
        .request(app)
        .get(
          "/api/v1/comic-comment/monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132?page=2"
        )
        .end(EndPaginationItem(done));
    });

    it("it should have list of comment", (done) => {
      chai
        .request(app)
        .get(
          "/api/v1/comic-comment/monster-ga-afureru-sekai-ni-natta-node-suki-ni-ikitai-to-omoimasu-25132?page=1"
        )
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data").with.be.a("array");

          done();
        });
    });
  });
});
