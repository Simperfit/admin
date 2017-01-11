import React from 'react';
import {DateInput, TextInput, BooleanInput, ReferenceInput, SelectInput} from 'admin-on-rest/lib/mui';

export default (input, admin) => {
  if ('http://www.w3.org/ns/hydra/core#Link' === input.type) {
    return <ReferenceInput source={input.name}
                           reference={admin.resources.find(r => r.range === input.range).name} key={input.name}>
      <SelectInput optionText="id"/>
    </ReferenceInput>
  }

  switch (input.range) {
    case 'http://www.w3.org/2001/XMLSchema#date':
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
      return <DateInput source={input.name} key={input.name}/>;

    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return <BooleanInput source={input.name} key={input.name}/>;

    default:
      return <TextInput source={input.name} key={input.name}/>;
  }
}
