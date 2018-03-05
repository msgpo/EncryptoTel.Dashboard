import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import {LoggerServices} from './logger.services';
import {MessageServices} from './message.services';

import {environment as _env} from '../environments/environment';

/*
  Parent request services. Processing errors and console output for responses
*/

@Injectable()
export class RequestServices {
  constructor(private http: HttpClient,
              private _messages: MessageServices,
              private logger: LoggerServices) {}
  /*
    Default POST request. Accepted params:
    URI: string - request uri,
    Data: object - request params
   */
  post(uri: string, data: object): Promise<any> {
    return this.http.post(`${_env.back}/${uri}`, {...data}, {observe: 'response'}).toPromise() // Request to promise conversion
      .then(response => { // Successful request processing
        this.logger.log('POST-request response', response); // Console output for response
        return Promise.resolve(response.body); // Return response body to children method
      }).catch(response => { // Non-successful request processing
        switch (response.status) { // Switch response error status
          default: {
            this._messages.writeError(response.error.message || 'Internal server error'); // Adding warning message
            break;
          }
        }
        this.logger.log('POST-request error', { // Console output for response error details
          status: response.status || 'Response status is empty',
          message: response.error.message || 'Unknown internal server error'
        });
        return Promise.reject(response.error);
      });
  }
  /*
    Default PUT request. Accepted params:
    URI: string - request uri,
    Data: object - request params
   */
  put(uri: string, data: object): Promise<any> {
    return this.http.put(`${_env.back}/${uri}`, {...data}, {observe: 'response'}).toPromise() // Request to promise conversion
      .then(response => { // Successful request processing
        this.logger.log('PUT-request response', response); // Console output for response
        return Promise.resolve(response.body); // Return response body to children method
      }).catch(response => { // Non-successful request processing
        switch (response.status) { // Switch response error status
          default: {
            this._messages.writeError(response.error.message || 'Internal server error'); // Adding warning message
            break;
          }
        }
        this.logger.log('PUT-request error', { // Console output for response error details
          status: response.status || 'Response status is empty',
          message: response.error.message || 'Unknown internal server error'
        });
        return Promise.reject(response.error);
      });
  }
  /*
    Default GET request. Accepted params:
    URI: string - request uri with stringified params
   */
  get(uri: string): Promise<any> {
    return this.http.get(`${_env.back}/${uri}`, {observe: 'response'}).toPromise() // Request to promise conversion
      .then(response => { // Successful request processing
        this.logger.log('GET-request response', response); // Console output for response
        return Promise.resolve(response.body); // Return response body to children method
      }).catch(response => { // Non-successful request processing
        switch (response.status) { // Switch response error status
          default: {
            this._messages.writeError(response.error.message || 'Internal server error'); // Adding warning message
            break;
          }
        }
        this.logger.log('GET-request error', { // Console output for response error details
          status: response.status || 'Response status is empty',
          message: response.error.message || 'Unknown internal server error'
        });
        return Promise.reject(response.error);
      });
  }
  /*
    Default DELETE request. Accepted params:
    URI: string - request uri with stringified params
   */
  del(uri: string): Promise<any> {
    return this.http.delete(`${_env.back}/${uri}`, {observe: 'response'}).toPromise() // Request to promise conversion
      .then(response => { // Successful request processing
        this.logger.log('DELETE-request response', response); // Console output for response
        return Promise.resolve(response.body); // Return response body to children method
      }).catch(response => { // Non-successful request processing
        switch (response.status) { // Switch response error status
          default: {
            this._messages.writeError(response.error.message || 'Internal server error'); // Adding warning message
            break;
          }
        }
        this.logger.log('DELETE-request error', { // Console output for response error details
          status: response.status || 'Response status is empty',
          message: response.error.message || 'Unknown internal server error'
        });
        return Promise.reject(response.error);
      });
  }
}