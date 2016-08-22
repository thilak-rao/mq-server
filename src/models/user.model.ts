import * as Joi from "joi";

export const createUserModel = Joi.object().keys({
	firstName: Joi.string().required(),
	lastName : Joi.string().required(),
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required(),
}).label("User Model").description("Json body that represents a new user.");

export const authenticationModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
}).label("User Model").description("Json body that represents user login credentials");

export const deleteUserModel = Joi.object().keys({
	email    : Joi.string().email().required(),
	password : Joi.string().regex(/.{8,30}$/).required()
}).label("User Model").description("Json body that authenticates if a valid user is requesting deletion");

export const updateUserModel = Joi.object().keys({
	firstName  : Joi.string(),
	lastName   : Joi.string(),
	email      : Joi.string().email(),
	newPassword: Joi.string().regex(/.{8,30}$/),
	oldPassword: Joi.string().regex(/.{8,30}$/)
}).label("User Model").description("Json body that represents optional key/values are required to be updated");
