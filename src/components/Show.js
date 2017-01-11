import React, {Component} from 'react';
import {Show as BaseShow, TextField} from 'admin-on-rest/lib/mui';
import fieldFactory from './fieldFactory';

class Show extends Component {
  render() {
    return <BaseShow {...this.props}>
      <TextField source="id"/>
      {this.props.options.resource.readableFields.map(field => fieldFactory(field, this.props.options.admin))}
    </BaseShow>
  }
}

export default Show
