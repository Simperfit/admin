import React, {Component} from 'react';
import './App.css';
import {Admin as BaseAdmin, Resource} from 'admin-on-rest';
import {
  List,
  Datagrid,
  Create,
  Show,
  Edit,
  Delete,
  ShowButton,
  EditButton,
  ReferenceField,
  TextField,
  EmailField,
  DateField,
  NumberField,
  BooleanField,
  DisabledInput,
  DateInput,
  TextInput,
  BooleanInput
} from 'admin-on-rest/lib/mui';
import hydraClient from './hydraClient';
import adminGenerator from './adminGenerator';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {admin: null};

    adminGenerator(props.apiUrl).then(admin => this.setState({admin: admin}));
  }

  getField = field => {
    if ('http://www.w3.org/ns/hydra/core#Link' === field.type) {
      return (
        <ReferenceField source={field.name}
                        reference={this.state.admin.resources.find(r => r.range === field.range).name}>
          <TextField source="id" />
        </ReferenceField>
      );
    }

    switch (field.range) {
      case 'http://www.w3.org/2001/XMLSchema#date':
      case 'http://www.w3.org/2001/XMLSchema#dateTime':
        return <DateField source={field.name} />;

      case 'http://www.w3.org/2001/XMLSchema#integer':
      case 'http://www.w3.org/2001/XMLSchema#float':
        return <NumberField source={field.name} />;

      case 'http://www.w3.org/2001/XMLSchema#boolean':
        return <BooleanField source={field.name} />;

      case 'http://www.w3.org/2001/XMLSchema#string':
        return <TextField source={field.name} />;

      case 'http://schema.org/email':
        return <EmailField source={field.name} />;

      default:
        return <TextField source={field.name} />;
    }
  };

  getInput = field => {
    switch (field.range) {
      case 'http://www.w3.org/2001/XMLSchema#date':
      case 'http://www.w3.org/2001/XMLSchema#dateTime':
        return <DateInput source={field.name} />;

      case 'http://www.w3.org/2001/XMLSchema#integer':
      case 'http://www.w3.org/2001/XMLSchema#float':
      case 'http://www.w3.org/2001/XMLSchema#string':
      case 'http://schema.org/email':
        return <TextInput source={field.name} />;

      case 'http://www.w3.org/2001/XMLSchema#boolean':
        return <BooleanInput source={field.name} />;

      default:
        return <span />;
    }
  };

  getList = props => {
    return <List {...props}>
      <Datagrid>
        <TextField source="id"/>
        {this.state.admin.resources.find(r => r.name === props.resource).readableFields.map(field =>
          this.getField(field)
        )}
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>;
  }

  getShow = props =>
    <Show {...props}>
      <TextField source="id"/>
      {this.state.admin.resources.find(r => r.name === props.resource).readableFields.map(field =>
        this.getField(field)
      )}
    </Show>;

  getCreate = props => (
    <Create {...props}>
      {this.state.admin.resources.find(r => r.name === props.resource).readableFields.map(field =>
        this.getInput(field)
      )}
    </Create>
  );

  getEdit = props =>
    <Edit {...props}>
      <DisabledInput source="id"/>
      {this.state.admin.resources.find(r => r.name === props.resource).readableFields.map(field =>
        this.getInput(field)
      )}
    </Edit>;

  render() {
    if (!this.state.admin) {
      return <span />
    }

    return (
      <BaseAdmin title={this.state.admin.title} restClient={hydraClient(this.props.apiUrl)}>
        {this.state.admin.resources.map(resource =>
          <Resource key={resource.name} name={resource.name} list={this.getList} show={this.getShow} create={this.getCreate} edit={this.getEdit} remove={Delete} />
        )}
      </BaseAdmin>
    );
  }
}

Admin.propTypes = {
  apiUrl: React.PropTypes.string.isRequired
};

export default Admin;
