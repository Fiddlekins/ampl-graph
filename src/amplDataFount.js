import getAmplData from './getAmplData.js';

const pollRate = 1000 * 60 * 60;

class AmplDataFount {
	constructor() {
		this._handlers = {};
		this._boundPollData = this._pollData.bind(this);
		this._pollData();
	}

	on(eventName, handler, context) {
		if (!this._handlers[eventName]) {
			this._handlers[eventName] = new Set();
		}
		this._handlers[eventName].add({handler, context});
	}

	off(eventName, handler, context = null) {
		if (!this._handlers[eventName]) {
			return;
		}
		for (const eventHandler of this._handlers[eventName]) {
			if (eventHandler.handler === handler && (!context || eventHandler.context === context)) {
				this._handlers[eventName].delete(eventHandler);
			}
		}
	}

	emit(eventName, ...args) {
		if (!this._handlers[eventName]) {
			return;
		}
		for (const {handler, context} of this._handlers[eventName]) {
			if (context) {
				handler.call(context, ...args);
			} else {
				handler(...args);
			}
		}
	}

	async _pollData() {
		const data = await getAmplData();
		this.emit('data', data);
		setTimeout(this._boundPollData, pollRate);
	}
}

const ampleDataFount = new AmplDataFount();

export default ampleDataFount;
