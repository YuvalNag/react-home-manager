import React, { Fragment, Component } from 'react'
import Model from '../../components/UI/VerticallyCenteredModal/VerticallyCenteredModal'
import { isCancel } from 'axios'


const withErrorHandler = (WrappedComponent, axios) => {

    return class extends Component {
        state = {
            error: null
        }
        componentDidMount() {
            this.reqInterceptor = axios.interceptors.request.use(null, request => {
                this.setState({ error: null })
                return request
            })
            console.log(this.state.error);

            this.resInterceptor = axios.interceptors.response.use(response => response, error => this.setState({ error: error }))
        }
        componentWillUnmount() {
            console.log("will unmount", this.reqInterceptor, this.resInterceptor)
            axios.interceptors.request.eject(this.reqInterceptor)
            axios.interceptors.response.eject(this.resInterceptor)
        }
        modelConfirmedHandler = () => this.setState({ error: null })
        render() {
            console.log(this.state.error);

            return (

                <Fragment>
                    {this.state.error && !isCancel(this.state.error) &&
                        <Model show={this.state.error != null} onHide={this.modelConfirmedHandler}>
                            {this.state.error.message}
                        </Model>}
                    <WrappedComponent {...this.props} />
                </Fragment>

            )
        }
    }
}
export default withErrorHandler