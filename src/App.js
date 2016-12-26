import React, { Component } from 'react';
import './App.css';
import { Admin, Resource } from 'admin-on-rest';
import { List, Datagrid, Create, Edit, Delete, EditButton, ReferenceField, TextField, EmailField, DateField, NumberField, BooleanField, DisabledInput, DateInput, TextInput, BooleanInput } from 'admin-on-rest/lib/mui';
import hydraClient from './hydraClient';
import adminGenerator from './adminGenerator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { admin: null };

    adminGenerator('http://localhost/app_dev.php').then(admin => this.setState({ admin: admin }));
  }

  getField(field) {
    if ('http://www.w3.org/ns/hydra/core#Link' === field.type) {
      return (
        <ReferenceField source={field.name} reference="users">
          <TextField source="@id" />
        </ReferenceField>
      );
    }

    switch (field.range) {
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
  }

  getInput(field) {
    switch (field.range) {
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
  }

  getResourceNameFromRange = (range) => {
    for (let [key, value] of Object.entries(this.state.admin)) {
      if (range === value.range) {
        return key;
      }
    }

    throw new Error(`Resource of range ${range}`);
  };

  getList = (props) => (
    <List {...props}>
      <Datagrid>
        <TextField source="@id" label="id" />
        {Object.keys(this.state.admin.resources[props.resource].readableFields).map(key =>
            this.getField(this.state.admin.resources[props.resource].readableFields[key])
        )}
        <EditButton />
      </Datagrid>
    </List>
  );

  getCreate = (props) => (
    <Create {...props}>
      {Object.keys(this.state.admin.resources[props.resource].readableFields).map(key =>
        this.getInput(this.state.admin.resources[props.resource].readableFields[key])
      )}
    </Create>
  );

  getEdit = (props) => (
    <Edit {...props}>
      <DisabledInput source="@id" label="id" />
      {Object.keys(this.state.admin.resources[props.resource].readableFields).map(key =>
        this.getInput(this.state.admin.resources[props.resource].readableFields[key])
      )}
    </Edit>
  );

  render() {
    const admin = this.state.admin;

    if (admin) {
      return (
        <Admin title={admin.title} restClient={hydraClient('http://localhost/app_dev.php')}>
          {Object.keys(admin.resources).map(resource =>
            <Resource key={resource} name={resource} list={this.getList} create={this.getCreate} edit={this.getEdit} remove={Delete} />
          )}
        </Admin>
      );
    }

    return (
      <div />
    )
  }
}

export default App;
