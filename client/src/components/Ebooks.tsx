import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { addEbook, deleteEbook, getEbooks, patchEbook } from '../api/ebooks-api'
import Auth from '../auth/Auth'
import { Ebook } from '../types/Ebook'

interface EbooksProps {
  auth: Auth
  history: History
}

interface EbooksState {
  ebooks: Ebook[]
  newEbookTitle: string
  loadingEbooks: boolean
}

export class Ebooks extends React.PureComponent<EbooksProps, EbooksState> {
  state: EbooksState = {
    ebooks: [],
    newEbookTitle: '',
    loadingEbooks: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newEbookTitle: event.target.value })
  }

  onEditButtonClick = (ebookId: string) => {
    this.props.history.push(`/ebooks/${ebookId}/edit`)
  }

  onEbookAdd = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newEbook = await addEbook(this.props.auth.getIdToken(), {
        title: this.state.newEbookTitle,
        author: '',
        publisher: ''
      })
      this.setState({
        ebooks: [...this.state.ebooks, newEbook],
        newEbookTitle: ''
      })
    } catch {
      alert('Ebook creation failed')
    }
  }

  onEbookDelete = async (ebookId: string) => {
    try {
      await deleteEbook(this.props.auth.getIdToken(), ebookId)
      this.setState({
        ebooks: this.state.ebooks.filter(ebook => ebook.ebookId != ebookId)
      })
    } catch {
      alert('Ebook deletion failed')
    }
  }

  onEbookCheck = async (pos: number) => {
    try {
      const ebook = this.state.ebooks[pos]
      await patchEbook(this.props.auth.getIdToken(), ebook.ebookId, {
        title: ebook.title,
        author: ebook.author,
        publisher: ebook.publisher
      })
      // this.setState({
      //   ebooks: update(this.state.ebooks, {
      //     [pos]: { done: { $set: !todo.done } }
      //   })
      // })
    } catch {
      alert('Ebook update failed')
    }
  }

  async componentDidMount() {
    try {
      const ebooks = await getEbooks(this.props.auth.getIdToken())
      this.setState({
        ebooks,
        loadingEbooks: false
      })
    } catch (e) {
      alert(`Failed to fetch ebooks: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My Awesome Ebooks Collection</Header>

        {this.renderCreateEbookInput()}

        {this.renderEbooks()}
      </div>
    )
  }

  renderCreateEbookInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'blue',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Ebook',
              onClick: this.onEbookAdd
            }}
            fluid
            actionPosition="left"
            placeholder="The shadow of the wind..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderEbooks() {
    if (this.state.loadingEbooks) {
      return this.renderLoading()
    }

    return this.renderEbooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading EBOOKS
        </Loader>
      </Grid.Row>
    )
  }

  renderEbooksList() {
    return (
      <Grid padded>
        {this.state.ebooks.map((ebook, pos) => {
          return (
            <Grid.Row key={ebook.ebookId}>
              <Grid.Column width={10} verticalAlign="middle">
                {ebook.title}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="yellow"
                  onClick={() => this.onEditButtonClick(ebook.ebookId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onEbookDelete(ebook.ebookId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              {ebook.attachmentUrl && (
                <a href={ebook.attachmentUrl}>
                <Image src="download.png"  /></a>
              )}
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
