import React, {Component} from 'react';
import {Edit as BaseEdit, DisabledInput} from 'admin-on-rest/lib/mui';
import inputFactory from './inputFactory';

class Edit extends Component {
  render() {
    return <BaseEdit {...this.props}>
      <DisabledInput source="id"/>
      {this.props.options.resource.readableFields.map(field => inputFactory(field, this.props.options.admin))}
    </BaseEdit>
  }
}

export default Edit
