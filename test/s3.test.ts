/// <reference path="../typings/index.d.ts" />

// import UserBucket from "../server/libs/buckets/user.bucket";
// import {STATUS} from "../server/configs/constants";
// const Lab     = require('lab'),
//       Code    = require('code'),
//       request = require('request'),
//       lab     = exports.lab = Lab.script(),
//       mockFile = 'mocks/s3-mock.png';
//
// lab.experiment("\n\n\n***** User File Storage Test *****\n", () => {
// 	const bucketName = 'user.test',
// 	      userBucket = new UserBucket(bucketName);
//
// 	let itemKey = null;
//
// 	lab.test("Create a new user bucket", (done) => {
// 		userBucket.createNewBucket()
// 		          .then((data) => {
// 			          Code.expect(data.Location).to.include(bucketName);
// 			          done();
// 		          })
// 		          .catch((error) => {
// 			          console.error(error);
// 			          Code.expect(error).to.be.undefined();
// 			          done();
// 		          });
// 	});
//
// 	lab.test("Upload file test", (done) => {
// 		userBucket.uploadFile(mockFile)
// 		          .then((result) => {
// 			          Code.expect(result['status']).to.equal(STATUS.SUCCESSFUL);
// 			          Code.expect(result['key']).to.exist();
// 			          itemKey = result['key'];
// 			          done();
// 		          })
// 		          .catch((error) => {
// 			          console.error(error);
// 			          Code.expect(error).to.be.undefined();
// 			          done();
// 		          });
// 	});
//
// 	lab.test("Get signed url and verify url", (done) => {
// 		userBucket.getSignedUrl(itemKey)
// 		          .then((url) => {
// 			          request(url, (error, response) => {
// 				          if (error) {
// 					          console.error(error);
// 					          Code.expect(error).to.be.undefined();
// 					          done();
// 				          }
//
// 				          Code.expect(response.statusCode).to.equal(200);
// 				          done();
// 				          // TODO: Add tests for expiry
// 			          });
// 		          })
// 		          .catch((error) => {
// 			          console.error(error);
// 			          Code.expect(error).to.be.undefined();
// 			          done();
// 		          });
// 	});
//
// 	lab.test("Delete object from S3 bucket", (done) => {
// 		userBucket.deleteObject(itemKey)
// 		          .then((result) => {
// 			          Code.expect(result['status']).to.equal(STATUS.SUCCESSFUL);
// 			          Code.expect(result['key']).to.equal(itemKey);
// 			          done();
// 		          })
// 		          .catch((error) => {
// 			          console.error(error);
// 			          Code.expect(error).to.be.undefined();
// 		          });
//
// 	});
//
// 	lab.test("Delete the test bucket that was created", (done) => {
// 		userBucket.deleteBucket()
// 		          .then((result) => {
// 			          Code.expect(result).to.be.exist();
// 			          done();
// 		          })
// 		          .catch((error) => {
// 			          console.error(error);
// 			          Code.expect(error).to.be.undefined();
// 			          done();
// 		          });
// 	});
// });
