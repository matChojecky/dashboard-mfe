import type Dashboard from '../screens/Dashboard';
import type Settings from '../screens/Settings';

export default class Application {
    constructor(
        private dashboard: Dashboard,
        private settings: Settings
        ) {
            this.dashboard.mount();
            this.dashboard.run();
        }
}