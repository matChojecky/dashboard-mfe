const { AirPolutionWidget } = require('./packages/widgets/air_polution/widget.config');

module.exports = {
    AirPolutionWidget
}
module.exports.SUPPORTED_WIDGETS = (function (env) {
    const widgets = [
        AirPolutionWidget
    ]
    return widgets.map(w => ({ ...w, url: w.url[env] }));
})(process.env.NODE_ENV?.toLowerCase() ?? 'dev')