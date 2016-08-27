/// <reference path="../typings/index.d.ts" />

import UserBucket from "../src/libs/buckets/user.bucket";
const Lab  = require('lab'),
      Code = require('code'),
      lab  = exports.lab = Lab.script();

lab.experiment("\n\n\n***** User File Storage Test *****\n", () => {
	const bucketName = 'user.test',
	      userBucket = new UserBucket(bucketName);

	lab.test("Create a new user bucket", (done) => {
		userBucket.createNewBucket()
		          .then((data) => {
			          Code.expect(data.Location).to.include(bucketName);
			          done();
		          })
		          .catch((error) => {
			          Code.expect(error).to.be.undefined();
			          done();
		          });
	});

	lab.test("Delete the test bucket that was created", (done) => {
		userBucket.deleteBucket()
		          .then((result) => {
			          Code.expect(result).to.be.exist();
			          done();
		          })
		          .catch((error) => {
			          Code.expect(error).to.be.undefined();
			          done();
		          });
	});
});
