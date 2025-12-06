const Joi = require("joi");

module.exports.dailyLogsSchema = Joi.object({
    text: Joi.string().min(3).max(500).required(),
    mood: Joi.number().valid(1,2,3,4,5).required(),
//jab user submit karega then backend should know which hobby the logs belog to, also regrex means
    hobby: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), 
});
// ^ → start of the string [0-9a-fA-F] → any single character that is a digit 0–9 or a letter a–f or A–F
// {24} → repeat the previous part exactly 24 times $ → end of the string
