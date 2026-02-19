import Joi from("joi");

exports.eventSchema = Joi.object({
  userId: Joi.string().required(), 
  productId: Joi.string().optional(),
  action: Joi.string()
    .valid("view", "click", "search", "add_to_cart", "purchase")
    .required(),
  metadata: Joi.object().optional(),
});
