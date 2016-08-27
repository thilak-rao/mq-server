import S3Bucket from "./s3.bucket";

class UserBucket extends S3Bucket  {
	constructor(private bucketName: string = 'user', private permissions = 'public-read') {
		super();
	}

	protected BucketName() {
		return this.bucketName;
	}

	protected ACL() {
		return this.permissions;
	}
}

export default UserBucket;
