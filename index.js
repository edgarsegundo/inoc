/*!
 * app-messenger
 * Copyright(c) 2021 Edgar R de Paula
 * MIT Licensed
 */

'use strict'

/**
 * Variables.
 * @private
 */
 var notifications = {}

/**
 * Module exports.
 * @public
 */

 module.exports.subscribe = subscribe
 module.exports.unsubscribe = unsubscribe
 module.exports.unsubscribeAll = unsubscribeAll
 module.exports.notify = notify

/**
 * Subscribe to receive change notification
 *
 * @param {String} notificationId
 * @param {String} subscriberId
 * @param {Object} state
 * @param {Function} notificationCallback
 * @param {Boolean} notifyOnlyOnce
 * @public
 */

function subscribe (notificationId, subscriberId, state, notificationCallback, notifyOnlyOnce = false) {
    let subscribers;

    if (notifications.hasOwnProperty(notificationId)) {
        subscribers = notifications[notificationId];
    } else {
        subscribers = [];
        notifications[notificationId] = subscribers;
    }

    subscribers.push(createSubscriber(notificationId, subscriberId, state, notificationCallback, notifyOnlyOnce));
}

/**
 * Unsubscribe to stop receiving notification
 *
 * @param {String} notificationId
 * @param {String} subscriberId
 * @return {Integer}
 * @public
 */

 function unsubscribe (notificationId, subscriberId) {
    if (notifications.hasOwnProperty(notificationId)) {
        let subscribers = notifications[notificationId];
        if(subscribers) {
            let count = 0
            for(let i = 0; i < subscribers.length; i += 1) {
                if (subscriberId == subscribers[i].subscriberId) {
                    subscribers.splice(i, 1)
                    i -= 1
                    count += 1
                }
            }
            return count
        }
      }
}

/**
 * Unsubscribe all notifications of a subscriber
 *
 * @param {String} subscriberId
 * @public
 */

function unsubscribeAll(subscriberId) {
    if(subscriberId)
        for (let key in notifications)
            if (notifications.hasOwnProperty(key)) unsubscribe(key, subscriberId)
}

/**
 * Iterate through notifications to notify all subscribers
 *
 * @param {String} notificationId
 * @param {String} notifierId
 * @param {Object} notifierState 
 * @public
 */

function notify (notificationId, notifierId, notifierState) {
    if (notifications.hasOwnProperty(notificationId)) {
        notifications[notificationId].forEach((subscriber) => {
            (subscriber.notificationCallback)(notifierId, notifierState, subscriber.state);
            if (subscriber.notifyOnlyOnce) {
                unsubscribe(notificationId, subscriber.subscriberId);
            }
        });
    }
}

 /**
 * Create and populate a subscriber object
 *
 * @param {String} notificationId
 * @param {String} notifierId
 * @param {Object} state
 * @param {Function} notificationCallback
 * @param {Boolean} notifyOnlyOnce
 * @return {Object}
 * @private
 */

  function createSubscriber(notificationId, subscriberId, state, notificationCallback, notifyOnlyOnce) {
    return {
        "notificationId": notificationId,
        "subscriberId": subscriberId,
        "state": state,
        "notificationCallback": notificationCallback,
        "notifyOnlyOnce": notifyOnlyOnce
    }
  }
  