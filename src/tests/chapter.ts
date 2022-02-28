import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../../index.js'
let should = chai.should();

chai.use(chaiHttp);

describe('Chapter', () => {

  describe('/GET truyen-tranh/{id}/{chapterId}/{hash}', () => {
    it('it should GET chapter', (done) => {
      chai.request(app)
      .get('/api/v1/truyen-tranh/vo-luyen-dinh-phong/chap-1735/796832')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data').with.be.a('object')
        res.body.data.should.have.property('path').with.be.a('string')
        res.body.data.should.have.property('title').with.be.a('string')
        res.body.data.should.have.property('chapterName').with.be.a('string')
        res.body.data.should.have.property('updatedAt').with.be.a('string')
        res.body.data.should.have.property('updatedDistance').with.be.a('string')
        res.body.data.should.have.property('images').with.be.a('array').with.length.greaterThanOrEqual(1)
        done()
      })
    })
  })
})
