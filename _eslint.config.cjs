const compatConfig = require("eslint/use-eslint-config-migration");

module.exports = compatConfig({
    configs: {
        base: "./.eslintrc"
    }
});
