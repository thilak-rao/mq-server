/// <reference path="../../../typings/index.d.ts" />
import {ISDEBUG, AWS_CONFIG} from "../../configs/environment";
import {STATUS} from "../../configs/constants";
const s3   = require('s3'),
      AWS  = require('aws-sdk'),
      UUID = require("node-uuid");

abstract class S3Bucket {
	protected S3;
	protected Client;
	protected abstract ACL(): string;
	protected abstract BucketName(): string;

	constructor() {
		this.S3 = new AWS.S3({
			accessKeyId    : AWS_CONFIG.accesskey,
			secretAccessKey: AWS_CONFIG.secretkey,
			region         : AWS_CONFIG.region
		});

		const clientOpt = {
			s3Client: this.S3
		};

		this.Client = s3.createClient(clientOpt);
	}

	public uploadFile(localFile: string): Promise<any> {
		const uuid = UUID.v4();
		const params = {
			localFile: localFile,
			s3Params : {
				Bucket: this.getBucketName(),
				Key   : uuid
			}
		};

		return new Promise((resolve, reject) => {
			const uploader = this.Client.uploadFile(params);

			uploader.on('error', (error) => {
				return reject(error);
			});

			uploader.on('end', () => {
				return resolve({
					status: STATUS.SUCCESSFUL,
					key: uuid
				});
			});
		});
	}

	public getSignedUrl(key: string, expires: number = AWS_CONFIG.urlExpiry): Promise<any> {
		if (!key) {
			throw 'getSignedUrl method requires key argument';
		}

		return new Promise((resolve, reject) => {
			this.S3.getSignedUrl('getObject', {
				Bucket : this.getBucketName(),
				Key    : key,
				Expires: expires
			}, (error, url) => {
				if (error) {
					return reject(error);
				}

				return resolve(url);
			});
		});
	}

	public deleteObject(key: string): Promise<any> {
		if (!key) {
			throw 'deleteObject method requires key argument';
		}

		return new Promise((resolve, reject) => {
			this.S3.deleteObject({
				Bucket: this.getBucketName(),
				Key: key
			}, (error) => {
				if (error) {
					return reject(error);
				}

				const result = {
					status: STATUS.SUCCESSFUL,
					key   : key
				};
				return resolve(result);
			});
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
			});
		});
	}

	public deleteBucket(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.S3.deleteBucket({
				Bucket: this.getBucketName()
			}, (error, data) => {
				if (error) {
					return reject(error);
				}
				return resolve(data);
			});
		});
	}

	private getBucketName(): string {
		if (ISDEBUG) {
			return `${this.BucketName()}.dev`;
		} else {
			return this.BucketName();
		}
	}
}

export default S3Bucket;
