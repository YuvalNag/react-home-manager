import React, { Component } from 'react';

import classes from './Auth.module.css'

import * as actions from '../../store/actions/index'
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ERRORS = {
    EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier.The user may have been deleted.',
    INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
    USER_DISABLED: 'The user account has been disabled by an administrator.',
    EMAIL_EXISTS: 'The email address is already in use by another account.',
    OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.'
}
class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                touched: false,
                valid: true,
                validationRules: {
                    required: true,
                    isEmail: true
                },
                validationError: null
            },
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: '',
                touched: false,
                valid: true,
                validationRules: {
                    required: true,
                },
                validationError: null
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                touched: false,
                valid: true,
                validationRules: {
                    required: true,
                    isPassword: true
                },
                validationError: null
            }
        },
        formIsValid: false,
        isSignIn: true
    }
    submitHandler = (event) => {
        event.preventDefault()
        // if (this.state.formIsValid) {
        this.props.onTryAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.controls.name.value, this.state.isSignIn)
        // }
    }
    switchModeHandler = () => {
        this.setState(prevState => { return { isSignIn: !prevState.isSignIn } })
    }
    inputChangedHandler = (event, inputId) => {
        const { updatedFrom, formIsValid } = checkValidity(event.target.value, inputId, this.state.controls)
        this.setState({ controls: updatedFrom, formIsValid: formIsValid })
    }

    render() {
        const formElementsArray = []
        for (const key in this.state.controls) {
            formElementsArray.push({
                key: key,
                data: this.state.controls[key]
            })

        }
        return (
            <div className={classes.Auth}>
                {/* {this.props.isLoading ? <Spinner /> :
                    <Form onSubmit={this.submitHandler}>
                        <h1>Welcome <br></br> {this.state.isSignIn ? 'Sign in' : 'Sing up'} please</h1>
                        {formElementsArray.map(formElement => <Form.Control key={formElement.key} {...formElement.data} changed={(event) => { this.inputChangedHandler(event, formElement.key) }} />)}
                        {this.props.errorMessage ? <h3 style={{ color: 'red' }}>{ERRORS[this.props.errorMessage] ? ERRORS[this.props.errorMessage] : this.props.errorMessage}</h3> : null}

                        <Button disabled={!this.state.formIsValid} btnType='Success' >SUBMIT</Button>
                    </Form>} */}
                {this.props.isLoading ? <Spinner animation="border" variant='secondary' /> :
                    <Form onSubmit={this.submitHandler}>
                        <h3>{this.state.isSignIn ? 'כניסה' : 'הרשמה'}</h3>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>אימייל</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(event) => { this.inputChangedHandler(event, 'email') }} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                      </Form.Text>
                        </Form.Group>
                        {!this.state.isSignIn && <Form.Group controlId="formBasicName">
                            <Form.Label>שם משתמש</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" onChange={(event) => { this.inputChangedHandler(event, 'name') }} />
                        </Form.Group>}
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>סיסמא</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(event) => { this.inputChangedHandler(event, 'password') }} />
                        </Form.Group>

                        <Button variant="outline-success" type="submit">
                            התחבר
                    </Button>
                    </Form>}

                <Button className='m-2'
                    variant='danger'
                    onClick={this.switchModeHandler}>
                    {this.state.isSignIn ? 'להרשמה' : 'לכניסה'}
                </Button>
                {this.props.isAuth ? <Redirect to='/supermarket' /> : null}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        isLoading: state.reqToServer.loading,
        errorMessage: state.reqToServer.error,
        isAuth: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: (email, password, name, isSignIn) => dispatch(actions.tryAuth(email, password, name, isSignIn))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);