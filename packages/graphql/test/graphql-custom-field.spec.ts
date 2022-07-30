import { printSchema } from 'graphql';
import { addGraphQLCustomField } from '../src/lib/graphql-custom-fields';

describe('addGraphQLCustomField()', () => {
  it('should uses JSON scalar if no custom fields defined', () => {
    const input = `
        type Product {
            id: ID
        }
    `;

    const customFieldConfig = {
      Product: [],
    };

    const result = addGraphQLCustomField(input, customFieldConfig, false);
    expect(printSchema(result)).toMatchSnapshot();
  });

  it('should extends a type', () => {
    const input = `
      type Product {
          id: ID
      }
    `;

    const customFieldConfig = {
      Product: [{ name: 'available', type: 'boolean' }],
    };

    const result = addGraphQLCustomField(input, customFieldConfig, false);

    expect(printSchema(result)).toMatchSnapshot();
  });
});
