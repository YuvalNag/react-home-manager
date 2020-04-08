import React, { Component, useState, Fragment, useEffect } from 'react';

import classes from './Auth.module.css'

import * as actions from '../../store/actions/index'
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { Alert } from 'react-bootstrap';

// const ERRORS = {
//     EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier.The user may have been deleted.',
//     INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
//     USER_DISABLED: 'The user account has been disabled by an administrator.',
//     EMAIL_EXISTS: 'The email address is already in use by another account.',
//     OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
//     TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.'
// }
// class Auth extends Component {
//     state = {
//         controls: {
//             email: {
//                 elementType: 'input',
//                 elementConfig: {
//                     type: 'email',
//                     placeholder: 'Email'
//                 },
//                 value: '',
//                 touched: false,
//                 valid: true,
//                 validationRules: {
//                     required: true,
//                     isEmail: true
//                 },
//                 validationError: null
//             },
//             name: {
//                 elementType: 'input',
//                 elementConfig: {
//                     type: 'text',
//                     placeholder: 'Name'
//                 },
//                 value: '',
//                 touched: false,
//                 valid: true,
//                 validationRules: {
//                     required: true,
//                 },
//                 validationError: null
//             },
//             password: {
//                 elementType: 'input',
//                 elementConfig: {
//                     type: 'password',
//                     placeholder: 'Password'
//                 },
//                 value: '',
//                 touched: false,
//                 valid: true,
//                 validationRules: {
//                     required: true,
//                     isPassword: true
//                 },
//                 validationError: null
//             }
//         },
//         formIsValid: false,
//         isSignIn: true
//     }
//     submitHandler = (event) => {
//         event.preventDefault();

//         const form = event.currentTarget;
//         if (form.checkValidity() === false) {
//             event.stopPropagation();
//         }
//         else {
//             this.setState({ formIsValid: true });
//             this.props.onTryAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.controls.name.value, this.state.isSignIn)
//         }
//     }
// switchModeHandler = () => {
//     this.setState(prevState => { return { isSignIn: !prevState.isSignIn } })
// }
//     inputChangedHandler = (event, inputId) => {
//         const { updatedFrom, formIsValid } = checkValidity(event.target.value, inputId, this.state.controls)
//         this.setState({ controls: updatedFrom, formIsValid: formIsValid })
//     }

//     render() {
//         const formElementsArray = []
//         for (const key in this.state.controls) {
//             formElementsArray.push({
//                 key: key,
//                 data: this.state.controls[key]
//             })

//         }
//         return (
//             <div >
//                 {/* {this.props.isLoading ? <Spinner /> :
//                     <Form onSubmit={this.submitHandler}>
//                         <h1>Welcome <br></br> {this.state.isSignIn ? 'Sign in' : 'Sing up'} please</h1>
//                         {formElementsArray.map(formElement => <Form.Control key={formElement.key} {...formElement.data} changed={(event) => { this.inputChangedHandler(event, formElement.key) }} />)}
//                         {this.props.errorMessage ? <h3 style={{ color: 'red' }}>{ERRORS[this.props.errorMessage] ? ERRORS[this.props.errorMessage] : this.props.errorMessage}</h3> : null}

//                         <Button disabled={!this.state.formIsValid} btnType='Success' >SUBMIT</Button>
//                     </Form>} */}
//                 {this.props.isLoading ? <Spinner animation="border" variant='secondary' /> :
//                     <Form onSubmit={this.submitHandler} noValidate validated={this.state.formIsValid}>
//                         <h3>{this.state.isSignIn ? 'כניסה' : 'הרשמה'}</h3>
//                         <Form.Group controlId="formBasicEmail">
//                             <Form.Label>אימייל</Form.Label>
//                             <Form.Control type="email" placeholder="Enter email" onChange={(event) => { this.inputChangedHandler(event, 'email') }} />
//                             <Form.Text className="text-muted">
//                                 We'll never share your email with anyone else.
//                       </Form.Text>
//                         </Form.Group>
//                         {!this.state.isSignIn && <Form.Group controlId="formBasicName">
//                             <Form.Label>שם משתמש</Form.Label>
//                             <Form.Control type="text" minLength={5} maxLength={20} required placeholder="Enter your name" onChange={(event) => { this.inputChangedHandler(event, 'name') }} />
//                             <Form.Control.Feedback >
//                                 מעולה
//             </Form.Control.Feedback>
//                             <Form.Control.Feedback type="invalid">
//                                 אנא בחר שם בין חמישה לעשרה תווים
//             </Form.Control.Feedback>
//                         </Form.Group>}
//                         <Form.Group controlId="formBasicPassword">
//                             <Form.Label>סיסמא</Form.Label>
//                             <Form.Control type="password" placeholder="Password" onChange={(event) => { this.inputChangedHandler(event, 'password') }} required />
//                             <Form.Control.Feedback type="invalid">
//                                 Please provide a valid city.
//                             </Form.Control.Feedback>
//                         </Form.Group>

//                         <Button variant="outline-success" type="submit">
//                             התחבר
//                     </Button>
//                     </Form>}

//                 <Button className='m-2'
//                     variant='danger'
//                     onClick={this.switchModeHandler}>
//                     {this.state.isSignIn ? 'להרשמה' : 'לכניסה'}
//                 </Button>
//                 {this.props.isAuth ? <Redirect to='/supermarket' /> : null}
//             </div>
//         );
//     }
// }
// const mapStateToProps = state => {
//     return {
//         isLoading: state.reqToServer.loading,
//         errorMessage: state.reqToServer.error,
//         isAuth: state.auth.token !== null
//     }
// }
// const mapDispatchToProps = dispatch => {
//     return {
//         onTryAuth: (email, password, name, isSignIn) => dispatch(actions.tryAuth(email, password, name, isSignIn))
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Auth);
function Auth(props) {
    const [validated, setValidated] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);

    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [nameError, setNameError] = useState();
    const [validtionErrorMsg, setValidtionErrorMsg] = useState();



    const serverEmailError = props.errors && props.errors.errors && props.errors.errors.email && props.errors.errors.email.msg
    const serverPasswordError = props.errors && props.errors.errors && props.errors.errors.password && props.errors.errors.password.msg
    const serverNameError = props.errors && props.errors.errors && props.errors.errors.name && props.errors.errors.name.msg
    const serverValidtionErrorMsg = props.errors && props.errors.message

    useEffect(() => {
        setEmailError(serverEmailError)
        setPasswordError(serverPasswordError)
        setNameError(serverNameError)
        setValidtionErrorMsg(serverValidtionErrorMsg)
        return () => {
            'cleanup'
        }
    }, [serverEmailError, serverPasswordError, serverNameError, serverValidtionErrorMsg])
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        console.log(props.error)
        setValidated(true);
        props.onTryAuth(form.elements.formEmail.value, form.elements.formPassword.value, form.elements.formName && form.elements.formName.value, isSignIn)
    };

    return (
        <div style={{
            margin: '20px auto',
            width: '80%',
            textAlign: 'center',
            boxShadow: '0 2px 3px #ccc',
            border: '1px solid #aaa',
            padding: ' 10px',
            boxSizing: 'border-box'
        }}>

            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <h3>{isSignIn ? 'כניסה' : 'הרשמה'}</h3>
                <Form.Group controlId="formEmail">
                    <Form.Label>אימייל</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required />
                    <Form.Control.Feedback type="invalid">
                        {emailError}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text>
                </Form.Group>
                {!isSignIn && <Form.Group controlId="formName">
                    <Form.Label>שם משתמש</Form.Label>
                    <Form.Control type="text" minLength={5} maxLength={20} required placeholder="Enter your name" />
                    <Form.Control.Feedback >
                        מעולה
            </Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                        {nameError}
                    </Form.Control.Feedback>
                </Form.Group>}
                <Form.Group controlId="formPassword">
                    <Form.Label>סיסמא</Form.Label>
                    <Form.Control type="password" placeholder="Password" minLength={8} required pattern='/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$.!%*#?&])[a-zA-Z\d@$.!%*#?&]*$/
' />
                    <Form.Control.Feedback type="invalid">
                        {passwordError}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="outline-success" type="submit">
                    התחבר
                    </Button>
            </Form>


            < Button className='m-2'
                variant='danger'
                onClick={() => setIsSignIn(prevState => !prevState)} >
                {isSignIn ? 'להרשמה' : 'לכניסה'}
            </Button >
            {props.isAuth ? <Redirect to='/supermarket' /> : null}
            <Alert key='validtionError' variant='danger' show={validtionErrorMsg !== undefined} onClose={() => setValidtionErrorMsg(undefined)} dismissible>
                {validtionErrorMsg}
            </Alert>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        isLoading: state.reqToServer.loading,
        errors: state.reqToServer.error,
        isAuth: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: (email, password, name, isSignIn) => dispatch(actions.tryAuth(email, password, name, isSignIn))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);