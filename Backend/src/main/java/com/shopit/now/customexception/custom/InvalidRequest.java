package com.shopit.now.customexception.custom;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidRequest extends Exception {
    private static final long serialVersionUID = 1L;

    public InvalidRequest(String message) {
        super(message);
    }
}