export default {
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