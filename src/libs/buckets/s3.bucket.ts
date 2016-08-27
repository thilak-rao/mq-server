/// <reference path="../../../typings/index.d.ts" />
import {ISDEBUG, AWS_CONFIG} from "../../configs/environment";
import AWS = require('aws-sdk');

abstract class S3Bucket {
	protected S3;
	protected abstract ACL(): string;
	protected abstract BucketName(): string;

	constructor() {
		this.S3 = new AWS.S3({
			accessKeyId    : AWS_CONFIG.accesskey,
			secretAccessKey: AWS_CONFIG.secretkey,
			region         : AWS_CONFIG.region
		});
	}

	public createNewBucket(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.S3.createBucket({
				Bucket: this.getBucketName(),
				ACL: this.ACL()
			}, (error, response) => {
				if (error && error.code !== 'BucketAlreadyOwnedByYou') {
					return reject(error);
				}

				return resolve(response);
			})
		})
	}

	public deleteBucket() {
		return new Promise((resolve, reject) => {
			this.S3.deleteBucket({
				Bucket: this.getBucketName()
			}, (error, data) => {
				if (error) {
					return reject(error);
				}
				return resolve(data);
			});
		})
	}

	private getBucketName() {
		if(ISDEBUG) {
			return `${this.BucketName()}.dev`;
		} else {
			return this.BucketName();
		}
	}
}

export default S3Bucket;
