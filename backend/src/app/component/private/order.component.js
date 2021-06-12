const Joi = require('@hapi/joi');
const orderService = require('../../service/order.service');
const countryTimezone = require('../../constant/country-timezone');

module.exports = {
    getAll,
    create,
    getCountryTimezone,
};

async function getCountryTimezone(req, res, next)
{
    res.json({
        totalCount: countryTimezone.length,
        result: countryTimezone,
    });
}

async function getAll(req, res, next)
{
    let {search, sort, offset} = req.query;

    if (!search) {
        search = {};
    }

    if (req.user.role_id === 2) {
        search['customer_id'] = {
            condition: 'in',
            value: [req.user.customer_id],
        };
    }

    const totalCountResult = await orderService.getAll(search, true);
    const result = await orderService.getAll(search, false);
    res.json({
        totalCount: totalCountResult[0].totalCount,
        result: result,
    });
}

async function create(req, res, next) {
    const schema = Joi.object({
        customer_id: Joi.number().integer().required(),
        technician_id: Joi.number().integer().optional(),
        status_id: Joi.number().integer().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
        timezone: Joi.string().optional().allow(null, ""),
        start_date: Joi.string().required(),
        start_time: Joi.string().required(),
        end_date: Joi.string().optional().allow(null, ""),
        end_time: Joi.string().optional().allow(null, ""),
        pay_type_id: Joi.number().required(),
        fixed_pay: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        return false;
    }

    if (req.user.role_id === 2) {
        value.customer_id = req.user.customer_id;
    }

    value.created_by = req.user.id;
    const id = await orderService.create(value);

    res.json({
        success: true,
        message: 'Order created successfully',
        data: id,
    });
}