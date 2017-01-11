import React, {Component} from 'react';
import {Create as BaseCreate} from 'admin-on-rest/lib/mui';
import inputFactory from './inputFactory';

class Create extends Component {
  render() {
    return <BaseCreate {...this.props}>
      {this.props.options.resource.readableFields.map(field => inputFactory(field, this.props.options.admin))}
    </BaseCreate>
  }
}

export default Create
