import React, {Component} from 'react';
import {Admin as BaseAdmin, Resource} from 'admin-on-rest';
import {Delete} from 'admin-on-rest/lib/mui';
import hydraClient from '../hydra/hydraClient';
import adminGenerator from '../hydra/adminGenerator';
import List from './List';
import Show from './Show';
import Create from './Create';
import Edit from './Edit';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {admin: null};

    adminGenerator(props.apiUrl).then(admin => this.setState({admin: admin}));
  }

  render() {
    if (!this.state.admin) {
      return <span />
    }

    return (
      <BaseAdmin title={this.state.admin.title} restClient={hydraClient(this.props.apiUrl)}>
        {this.state.admin.resources.map(resource =>
          <Resource
            options={{admin: this.state.admin, resource}}
            key={resource.name}
            name={resource.name}
            list={List}
            show={Show}
            create={Create}
            edit={Edit}
            remove={Delete}
          />
        )}
      </BaseAdmin>
    );
  }
}

Admin.propTypes = {
  apiUrl: React.PropTypes.string.isRequired
};

export default Admin
