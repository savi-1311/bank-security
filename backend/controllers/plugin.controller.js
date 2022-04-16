const Plugin = require('../models/plugin.model');

const listPlugins = async (req, res) => {
    const plugins = await Plugin.find({});

    return res
        .status(200)
        .json({
            success: true,
            plugins: plugins
        });
};


module.exports = {
    listPlugins
};