import {Injectable} from 'angular2/core';

class Listener {
    public eventLabel: string;
    public listeners: Array<any> = [];
    constructor(eventLabel: string) {
        this.eventLabel = eventLabel;
    }
}
@Injectable()
export class Dispatcher {
    private listeners: Array<Listener> = [];
    public subscribe(eventLabel: string, callback: any) {
        var listener = this.getListener(eventLabel);
        if (!listener) {
            listener = this.createListener(eventLabel);
        }
        listener.listeners.push(callback);
    }
    public subscribeBound(eventLabel: string, scope: any, callback: any) {
        var boundCallback = function(eventData) {
            return callback.apply(scope, [eventData]);
        };
        this.subscribe(eventLabel, boundCallback);
    }
    public emit(eventLabel: string, data: any) {
        var listener: Listener = this.getListener(eventLabel);
        if (listener)
            listener.listeners.forEach(function (callback) {
                callback(data);
            });
    }
    private getListener(eventLabel: string) {
        return this.listeners.filter(function(listener: Listener) {
            return listener.eventLabel == eventLabel;
        }).pop();
    }
    private createListener(eventLabel: string): Listener {
        var listener = new Listener(eventLabel);
        this.listeners.push(listener);
        return listener;
    }
}
