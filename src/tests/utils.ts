import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";
let should = chai.should();

chai.use(chaiHttp);

export const EndPaginationItem = (done: any) => {
  return (err: any, res: any) => {
    res.body.should.have.property("pagination");
    res.body.pagination.should.have
      .property("max")
      .with.be.a("number")
      .to.greaterThanOrEqual(1);
    res.body.pagination.should.have
      .property("page")
      .with.be.a("number")
      .to.equal(2);
    res.body.should.have.property("success").to.equal(true);
    done();
  };
};
