package com.shopit.now.customexception;


import com.shopit.now.customexception.custom.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@ControllerAdvice
public class HandleException {

    @ExceptionHandler(UserAlreadyExists.class)
    public ResponseEntity<?> handleUserAlreadyExistsException(UserAlreadyExists exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<?> handleUserNotFoundException(UserNotFound exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<?> invalidCredentialsException(InvalidCredentials exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AddressNotFound.class)
    public ResponseEntity<?> addressNotFoundException(AddressNotFound exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(GlobalServerException.class)
    public ResponseEntity<?> globalServerException(GlobalServerException exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ProductNotFound.class)
    public ResponseEntity<?> handleProductNotFoundException(ProductNotFound exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidRequest.class)
    public ResponseEntity<?> handleInvalidRequestException(InvalidRequest exception, WebRequest request) {
        ExceptionDetails exceptionDetails = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity(exceptionDetails, HttpStatus.BAD_REQUEST);
    }
}