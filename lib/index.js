'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
module.exports = (joi) => {

    const args = {
        format: joi.alternatives([
            joi.string(),
            joi.array().items(joi.string().invalid('iso', 'javascript', 'unix'))
        ])
    };

    return {

        type: 'date',
        base: joi.date(),

        coerce: {
            from: 'string',
            method: function (value, { schema }) {

                const format = schema.$_getFlag('format');
                if (!format) {
                    return;
                }
                const date = schema.$_getFlag('utc') ? dayjs(value, format, true).utc() : dayjs(value, format, true);
                if (date.isValid()) {
                    return { value: date.toDate() };
                }
            }
        },

        rules: {
            utc: {
                method: function (enabled = true) {

                    return this.$_setFlag('utc', enabled);
                }
            }
        },

        overrides: {
            format: function (format) {

                joi.attempt(format, args.format, 'Invalid format');

                if (['iso', 'javascript', 'unix'].includes(format)) {
                    return this.$_super.format(format);
                }

                return this.$_setFlag('format', format);
            }
        }
    };
};
