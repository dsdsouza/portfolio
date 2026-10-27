import { Component } from 'react';
import ExternalLink from './ExternalLink.jsx';

// Network/chunk/PDF initialization failures must not take down the portfolio.
export default class PreviewBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="resume-loading" role="alert">
      This preview couldn’t load. <ExternalLink href={this.props.href}>Open the original</ExternalLink>
    </p> : this.props.children;
  }
}
