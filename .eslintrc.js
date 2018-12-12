module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "prefer-destructuring": 0,
        "no-underscore-dangle": 0,
        "no-param-reassign": 0,

        "arrow-body-style": 2,
        "arrow-spacing": ["warn", {"before": true, "after": true}],
        "brace-style": 2,
        "camelcase": [2, {"properties": "never"}],
        "complexity": ["warn", 5],
        "complexity": ["error", 10],
        "eqeqeq": "error",
        "linebreak-style": 0,
        "func-names": 0,
        "indent": ["error", 2],
        "quotes": [1, "single"],
        "max-depth": ["error", 3],
        "max-len": ["warn", { "code": 120, "tabWidth": 4 }],
        "max-lines": ["error", 150],
        "max-nested-callbacks": ["error", 4],
        "max-params": ["error", 6],
        "max-statements": ["error", 20],
        "no-trailing-spaces": 1,
        "no-magic-numbers": [1, {"ignore": [-1, 0, 1]}],
        "prefer-arrow-callback": 1,
        "overrides": [{
            "files": [ "*.test.js" ],
            "rules": {
                "max-lines-per-function": "off",
                "max-lines": "off",
                "no-magic-numbers": "off"
            }
        }]
    },
    "env" : {
        "jest": true
    }
};