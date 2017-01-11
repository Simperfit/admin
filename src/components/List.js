import React, {Component} from 'react';
import {List as BaseList, Datagrid, TextField, ShowButton, EditButton} from 'admin-on-rest/lib/mui';
import fieldFactory from './fieldFactory';

class List extends Component {
  render() {
    return <BaseList {...this.props}>
      <Datagrid>
        <TextField source="id"/>
        {this.props.options.resource.readableFields.map(field => fieldFactory(field, this.props.options.admin))}
        <ShowButton />
        <EditButton />
      </Datagrid>
    </BaseList>
  }
}

export default List
