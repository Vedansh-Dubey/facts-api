import React from 'react';
import ErrorFallback from '../pages/errorFallback/errorFallback';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {

      return <ErrorFallback/>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
