import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[ABYSSAL] 3D layer failed, using fallback visual.', err)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
