import React from 'react';
import {ReferenceField, TextField, EmailField, DateField, NumberField, BooleanField} from 'admin-on-rest/lib/mui';

export default (field, admin) => {
  if ('http://www.w3.org/ns/hydra/core#Link' === field.type) {
    return <ReferenceField source={field.name}
                           reference={admin.resources.find(r => r.range === field.range).name} key={field.name}>
      <TextField source="id"/>
    </ReferenceField>
  }

  switch (field.range) {
    case 'http://www.w3.org/2001/XMLSchema#date':
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
      return <DateField source={field.name} key={field.name}/>;

    case 'http://www.w3.org/2001/XMLSchema#integer':
    case 'http://www.w3.org/2001/XMLSchema#float':
      return <NumberField source={field.name} key={field.name}/>;

    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return <BooleanField source={field.name} key={field.name}/>;

    case 'http://www.w3.org/2001/XMLSchema#string':
      return <TextField source={field.name} key={field.name}/>;

    case 'http://schema.org/email':
      return <EmailField source={field.name} key={field.name}/>;

    default:
      return <TextField source={field.name} key={field.name}/>;
  }
}
