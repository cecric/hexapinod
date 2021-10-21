
/**
 * Validation schema example using AJV
 * @date 21/10/2021 - 11:57:40
 * @author cecric
 *
 * @type {{ type: string; properties: { example: { type: string; format: string; }; date_example: { instanceof: string; }; }; errorMessage: { properties: { example: string; date_example: string; }; }; }}
 */
export const testSchema = {
  'type': 'object',
  'properties': {
    'example': {
      'type': 'string',
      'format': 'email'
    },
    'date_example': {
      'instanceof': 'Date'
    }
  },
  'errorMessage': {
    'properties': {
      'example': 'example should be an email',
      'date_example': 'date_example should be a date'
    },
  },
};
