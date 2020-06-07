import React, { useState, useEffect } from 'react';
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Alert } from 'react-bootstrap';
import { loadingTypes } from '../../store/actions/shoppingCart';
import * as actionTypes from '../../store/actions/actionTypes';
import Stepper from 'react-stepper-horizontal'

import classes from './Auth.module.css';


function Auth(props) {
    const [validated, setValidated] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);

    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [nameError, setNameError] = useState();
    const [validationErrorMsg, setValidationErrorMsg] = useState(false);



    const serverEmailError = props.errors && props.errors.errors && props.errors.errors.email && props.errors.errors.email.msg
    const serverPasswordError = props.errors && props.errors.errors && props.errors.errors.password && props.errors.errors.password.msg
    const serverNameError = props.errors && props.errors.errors && props.errors.errors.name && props.errors.errors.name.msg
    const serverValidationErrorMsg = props.errors && props.errors.message

    useEffect(() => {
        setEmailError(serverEmailError)
        setPasswordError(serverPasswordError)
        setNameError(serverNameError)
        setValidationErrorMsg(serverValidationErrorMsg)
        return () => {
            'cleanup'
        }
    }, [serverEmailError, serverPasswordError, serverNameError, serverValidationErrorMsg])
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);
        props.onTryAuth(form.elements.formEmail.value, form.elements.formPassword.value, form.elements.formName && form.elements.formName.value, isSignIn)
    };
    const loadingAuth = props.loading && (((props.loadingType === loadingTypes.LOGIN || props.loadingType === loadingTypes.SIGNUP) && props.loadingType !== actionTypes.AUTH_SUCCESS))

    return (
        <div className={classes.Auth}>
            {!isSignIn && <Stepper steps={[{ title: 'הרשמה' }, { title: 'העדפות' }, { title: 'איך משתמשים'}]} activeStep={0} />}
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
                    <Form.Control type="password" placeholder="Password" minLength={8} required
                    // pattern='/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$.!%*#?&])[a-zA-Z\d@$.!%*#?&]*$/' 
                    />
                    <Form.Control.Feedback type="invalid">
                        {passwordError}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="outline-success" type="submit">
                    התחבר
                    </Button>
                {loadingAuth && <Spinner animation="border" key='spinner' variant='secondary' />}
            </Form>


            < Button className='m-2'
                variant='danger'
                onClick={() => setIsSignIn(prevState => !prevState)} >
                {isSignIn ? 'להרשמה' : 'לכניסה'}
            </Button >
            {props.isAuth ? <Redirect to='/home-manager/supermarket' /> : null}
            <Alert key='validationError' variant='danger' show={validationErrorMsg} onClose={() => setValidationErrorMsg(false)} dismissible>
                {validationErrorMsg}
            </Alert>
        </div>
    )

}

const mapStateToProps = state => {
    return {
        loading: state.reqToServer.loading,
        loadingType: state.reqToServer.loadingType,
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