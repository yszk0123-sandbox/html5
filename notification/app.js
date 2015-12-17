document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  const byId = function(id) {
    return document.getElementById(id);
  };

  const askPermissionButtonElement = byId('ask-permission-button');
  const notifyButtonElement = byId('notify-button');
  const appState = {
    canNotify: false
  };
  const config = {
    timeout: 5000
  };

  const updateState = function(propName, value) {
    appState[propName] = value;
  }

  const isNotificationSupported = function() {
    return 'Notification' in window;
  };

  const showMessage = function(message) {
    alert(message);
  };

  const showErrorMessage = function(message) {
    alert('Error: ' + message);
  };

  const askPermission = function() {
    return new Promise(function(resolve, reject) {
      if (!isNotificationSupported()) {
        return reject(new Error('This browser does not support desktop notification'));
      }

      if (Notification.permission === 'granted') {
        return resolve();
      }

      Notification.requestPermission(function(result) {
        if (result === 'granted') {
          return resolve();
        }

        if (result === 'denied') {
          return reject(new Error('Notification is denied'));
        }

        if (result === 'default') {
          return reject(new Error('Notification is cancelled'));
        }

        return reject(new Error('Unknown'));
      });
    });
  };

  const notify = function(title, body) {
    const options = {
      // icon: theIcon
      body: body
    };

    const notification = new Notification(title, options);

    setTimeout(function() {
      notification.close();
    }, config.timeout);
  }

  const onAskPermissionButtonClick = function() {
    askPermission()
      .then(function() {
        askPermissionButtonElement.setAttribute('disabled', 'disabled');
        notifyButtonElement.removeAttribute('disabled');
        updateState('canNotify', true);
      })
      .catch(showErrorMessage);
  };

  const onNotifyButtonClick = function() {
    if (!appState.canNotify) {
      return showErrorMessage('Cannot notify');
    }

    notify('Hello', 'world!');
  };

  askPermissionButtonElement.addEventListener('click', onAskPermissionButtonClick);
  notifyButtonElement.addEventListener('click', onNotifyButtonClick);
});
