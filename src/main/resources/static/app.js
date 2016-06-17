'use strict';

const React = require('react');
const client = require('./client');

const follow = require('./follow');

const stompClient = require('./websocket-listener');

const root = '/api';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { bricks: [], attributes: [], page: 1, pageSize: 5, links: {} };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
    let relArray = [ { rel: 'bricks', params: { size: pageSize } } ];
    follow(client, root, relArray).then(brickCollection => {
      return client({
        method: 'GET',
        path: brickCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      }).then(schema => {
        this.schema = schema.entity;
        return brickCollection;
      });
    }).done(brickCollection => {
      this.setState({
        bricks: brickCollection.entity._embedded.bricks,
        links: brickCollection.entity._links,
        attributes: Object.keys(this.schema.properties),
        pageSize: pageSize,
        page: brickCollection.entity.page
      });
    });
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  onNavigate(navUri) {
    client({
      method: 'GET',
      path: navUri
    }).done(brickCollection => {
      this.setState({
        bricks: brickCollection.entity._embedded.bricks,
        links: brickCollection.entity._links,
        attributes: this.state.attributes,
        pageSize: this.state.pageSize,
        page: brickCollection.entity.page
      });
    });
  }

  onCreate(newBrick) {
    let relArray = [ 'bricks' ];
    follow(client, root, relArray).done(response => {
      return client({
        method: 'POST',
        path: response.entity._links.self.href,
        entity: newBrick,
        headers: { 'Content-Type': 'application/json' }
      })
    });
  }

  onUpdate(brick, updatedBrick) {
    client({
      method: 'PUT',
      path: brick._links.self.href,
      entity: updatedBrick,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  onDelete(brick) {
    client({
      method: 'DELETE',
      path: brick._links.self.href
    });
  }

  refreshAndGoToLastPage(message) {
    let relArray = [ { rel: 'bricks', params: { size: this.state.pageSize } } ];
    follow(client, root, relArray).done(response => {
      if (response.entity._links.last !== undefined) {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshCurrentPage(message) {
    if (this.state.bricks.length === 1) {
      this.refreshAndGoToLastPage(message);
    } else {
      let relArray = [
        {
          rel: 'bricks',
          params: {
            size: this.state.pageSize,
            page: this.state.page.number
          }
        }
      ];
      follow(client, root, relArray).then(brickCollection => {
        return client({
          method: 'GET',
          path: brickCollection.entity._links.profile.href,
          headers: { 'Accept': 'application/schema+json' }
        }).then(schema => {
          this.schema = schema.entity;
          return brickCollection;
        });
      }).done(brickCollection => {
        this.setState({
          bricks: brickCollection.entity._embedded.bricks,
          links: brickCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          page: brickCollection.entity.page
        });
      });
    }
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
    stompClient.register([
      { route: '/topic/newBrick', callback: this.refreshAndGoToLastPage },
      { route: '/topic/updateBrick', callback: this.refreshCurrentPage },
      { route: '/topic/deleteBrick', callback: this.refreshCurrentPage }
    ]);
  }

  // TODO: Can order attributes?
  render() {
    return (
      <div>

        <CreateDialog
            attributes={ this.state.attributes }
            onCreate={ this.onCreate }
        />

        <BrickList
            bricks={ this.state.bricks } 
            links={ this.state.links }
            attributes={ this.state.attributes }
            pageSize={ this.state.pageSize }
            page={ this.state.page }
            updatePageSize={ this.updatePageSize }
            onNavigate={ this.onNavigate }
            onUpdate={ this.onUpdate }
            onDelete={ this.onDelete }
        />

      </div>
    );
  }

}

class CreateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var newBrick = {};
    this.props.attributes.forEach(attribute => {
      newBrick[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newBrick);

    // clear out the dialog's inputs
    this.props.attributes.forEach(attribute => {
      React.findDOMNode(this.refs[attribute]).value = '';
    });

    // Navigate away from the dialog to hide it.
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ attribute }>
        <input
            type="text"
            ref={ attribute }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    return (
      <div>

        <a href="#createBrick">
          Create
        </a>

        <div id="createBrick" className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Create New Brick</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Create
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

class UpdateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var updatedBrick = {};
    this.props.attributes.forEach(attribute => {
      updatedBrick[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onUpdate(this.props.brick, updatedBrick);
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ this.props.brick[attribute] }>
        <input
            type="text"
            ref={ attribute }
            defaultValue={ this.props.brick[attribute] }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    var dialogId = "updateBrick-" + this.props.brick._links.self.href;

    return (
      <div>

        <a href={ "#" + dialogId }>
          Update
        </a>

        <div id={ dialogId } className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Update a Brick</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Update
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

class BrickList extends React.Component {

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    var pageSize = React.findDOMNode(this.refs.pageSize).value;
    if (/^[0-9]+$/.test(pageSize)) {
      this.props.updatePageSize(pageSize);
    } else {
      React.findDOMNode(this.refs.pageSize).value =
        pageSize.substring(0, pageSize.length - 1);
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }

  render() {
    var pageInfo = this.props.page.hasOwnProperty('number') ?
        <h3>Bricks - Page { this.props.page.number + 1 } of { this.props.page.totalPages }</h3> : null;

    var bricks = this.props.bricks.map(brick =>
      <Brick
          key={ brick._links.self.href }
          brick={ brick }
          attributes={ this.props.attributes }
          onUpdate={ this.props.onUpdate }
          onDelete={ this.props.onDelete }
      />
    );

    var navLinks = [];
    if ('first' in this.props.links) {
      navLinks.push(<button key="first" onClick={ this.handleNavFirst }>&lt;&lt;</button>);
    }
    if ('prev' in this.props.links) {
      navLinks.push(<button key="prev" onClick={ this.handleNavPrev }>&lt;</button>);
    }
    if ('next' in this.props.links) {
      navLinks.push(<button key="next" onClick={ this.handleNavNext }>&gt;</button>);
    }
    if ('last' in this.props.links) {
      navLinks.push(<button key="last" onClick={ this.handleNavLast }>&gt;&gt;</button>);
    }

    return (
      <div>

        { pageInfo }

        <input
            ref="pageSize"
            defaultValue={ this.props.pageSize }
            onInput={ this.handleInput }
        />

        <table>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Color</th>
            <th>Element ID</th>
            <th></th>
            <th></th>
          </tr>
          { bricks }
        </table>

        <div>{ navLinks }</div>

      </div>
    )
  }

}

class Brick extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.brick);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.brick.name }</td>
        <td>{ this.props.brick.category }</td>
        <td>{ this.props.brick.color }</td>
        <td>{ this.props.brick.elementId }</td>
        <td>
          <UpdateDialog
              brick={ this.props.brick }
              attributes={ this.props.attributes }
              onUpdate={ this.props.onUpdate }
          />
        </td>
        <td>
          <button onClick={ this.handleDelete }>
            Delete
          </button>
        </td>
      </tr>
    )
  }

}

React.render(
  <App />,
  document.getElementById('react')
)
