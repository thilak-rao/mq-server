import * as Joi from "joi";

export const badRequest = Joi.object().keys({
	statusCode: Joi.number().equal(400),
	error     : Joi.string(),
	message   : Joi.string()
});
